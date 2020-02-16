// eslint-disable-next-line no-unused-vars
import AppError, { IAppErrorOptions } from './AppError';

export interface IResponseErrorOptions extends IAppErrorOptions {
  status?: number;
}

export default class ResponseError extends AppError {
  public status: number;

  constructor(options: IResponseErrorOptions) {
    super(options);

    if (this.name === 'AppError') {
      this.name = 'ResponseError';
    }

    this.status = options.status || 400;
  }
}
