// eslint-disable-next-line no-unused-vars
import Exception, { ExceptionConstruct } from './Exception';

export type ResponseExceptionConstruct = ExceptionConstruct & {
  status?: number;
};

export default class ResponseException extends Exception {
  public status: number;

  constructor(options: ResponseExceptionConstruct) {
    super(options);

    if (this.name === 'Exception') {
      this.name = 'ResponseException';
    }

    this.status = options.status || 400;
  }
}
