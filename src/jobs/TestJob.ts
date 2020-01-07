/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Job } from 'bull';

class TestJob {
  key: string = 'TestJob';

  handle(job: Job): any {
    console.log(`handle`, job.id);
  }

  onFailed(job: Job): any {
    console.log(`onFailed`, job.id);
  }

  onCompleted(job: Job): any {
    console.log('onCompleted', job.id);
  }
}

export default new TestJob();
