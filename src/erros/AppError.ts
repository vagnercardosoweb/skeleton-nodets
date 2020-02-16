export interface IAppErrorOptions {
  error?: Error;
  message: string;
  description?: string;
}

export default class AppError extends Error {
  public description?: string | undefined;

  constructor(options: IAppErrorOptions) {
    super();

    const { message, description, error } = options;

    this.name = error?.name || 'AppError';
    this.message = message;
    this.description = description || error?.message;
  }
}
