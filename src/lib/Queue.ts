import Bull from 'bull';

export type QueueJobOptions = Bull.JobOptions;

export interface IQueueClass {
  key: string;
  handle(job: Bull.Job, done: Bull.DoneCallback): any;
  onFailed?: (job: Bull.Job, error: Error) => any;
  onCompleted?: (job: Bull.Job, result: any) => any;
  concurrency?: number;
  options?: QueueJobOptions;
}

interface IQueue {
  jobs: IQueueClass[];
  bullOptions: Bull.QueueOptions;
}

interface IQueueBulls {
  bull: Bull.Queue;
  name: string;
  handle: Bull.ProcessCallbackFunction<any>;
  onFailed?: Bull.FailedEventCallback;
  onCompleted?: Bull.CompletedEventCallback;
  concurrency?: number;
  options?: QueueJobOptions;
}

export default class Queue implements IQueue {
  jobs: IQueueClass[];
  bullOptions: Bull.QueueOptions;
  _queues: IQueueBulls[] | null;

  constructor({ jobs, bullOptions }: IQueue) {
    this.jobs = jobs;
    this.bullOptions = bullOptions;
    this._queues = null;
  }

  get queues() {
    if (!this._queues) {
      this._queues = this.jobs.map(job => {
        return {
          bull: new Bull(job.key, this.bullOptions),
          name: job.key,
          handle: job.handle,
          onFailed: job.onFailed,
          onCompleted: job.onCompleted,
          concurrency: job.concurrency,
          options: job.options,
        };
      });
    }

    return this._queues;
  }

  get(name: string) {
    const queue = this.queues.find(q => q.name === name);

    if (!queue) {
      throw new Error('Queue not exists.');
    }

    return queue;
  }

  add(name: string, data: any, options?: QueueJobOptions) {
    const queue = this.get(name);

    queue.bull.add(data, { ...queue.options, ...options });
  }

  closeQueues() {
    this.queues.forEach(queue => queue.bull.close());
  }

  process() {
    this.queues.forEach(queue => {
      queue.bull.process(queue.concurrency || 1, queue.handle);

      if (queue.onFailed) {
        queue.bull.on('failed', queue.onFailed);
      }

      if (queue.onCompleted) {
        queue.bull.on('completed', queue.onCompleted);
      }
    });

    this.shutdown();
  }

  private shutdown() {
    process.on('SIGTERM', this.closeQueues);
    process.on('SIGINT', this.closeQueues);
  }
}
