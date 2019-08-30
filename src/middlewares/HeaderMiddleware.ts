import Middleware from './Middleware';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
      const headers = [
        'Accept',
        'Origin',
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Http-Method-Override',
      ];

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', methods.join(','));
      res.header('Access-Control-Allow-Headers', headers.join(','));

      if (req.method.toUpperCase() === 'OPTIONS') {
        return res.sendStatus(200);
      }

      next();
    };
  }
}
