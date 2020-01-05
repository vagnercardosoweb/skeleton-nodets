// eslint-disable-next-line no-unused-vars
import { RequestHandler, Response, Request } from 'express';
import morgan from 'morgan';

export default function MorganMiddleware(): RequestHandler {
  const format = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
  const skip = (_: Request, res: Response) =>
    format === 'combined' && res.statusCode < 400;

  return morgan(format, { skip });
}
