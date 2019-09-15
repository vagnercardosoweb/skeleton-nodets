// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Middleware from './Middleware';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
      const headers = [
        'Accept',
        'Origin',
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'X-Requested-With',
        'X-Http-Method-Override',
      ];

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', methods.join(','));
      res.header('Access-Control-Allow-Headers', headers.join(','));

      if (String(req.method).toUpperCase() === 'OPTIONS') {
        return res.sendStatus(200);
      }

      return next();
    };
  }
}
