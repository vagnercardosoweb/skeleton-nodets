// eslint-disable-next-line no-unused-vars
import { RequestHandler, Response, Request } from 'express';
import morgan from 'morgan';

import Middleware from './Middleware';

export default class SessionMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    const format = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
    const skip = (req: Request, res: Response) =>
      format === 'combined' && res.statusCode < 400;

    return morgan(format, { skip });
  }
}
