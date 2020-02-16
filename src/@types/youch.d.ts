declare module 'youch' {
  // eslint-disable-next-line no-unused-vars
  import { Request } from 'express';

  interface IYouch {
    toJSON(): Promise<any>;
    toHTML(): Promise<any>;
  }

  const Youch: {
    new (err: any, req: Request): IYouch;
  };

  export = Youch;
}
