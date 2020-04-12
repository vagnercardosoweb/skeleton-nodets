export type ExceptionConstruct = {
  error?: Error;
  message: string;
  description?: string;
  details?: any;
};

export default class Exception extends Error {
  public description?: string | undefined;
  public details?: any;

  constructor(options: ExceptionConstruct) {
    super();

    const { message, description, error } = options;

    this.name = error?.name || 'Error';
    this.message = message;
    this.description = description || error?.message;
    this.details = error || null;
  }
}
