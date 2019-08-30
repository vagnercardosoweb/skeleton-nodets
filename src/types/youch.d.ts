declare module 'youch' {
  import { Request } from 'express';

  class Youch {
    constructor(error: any, request: Request);
    toJSON(): Promise<any>;
    toHTML(): Promise<any>;
  }

  export = Youch;
}
