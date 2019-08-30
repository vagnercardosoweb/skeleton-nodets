import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import Middleware from './Middleware';
import configApp from '../config/app';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    this.application.set('trust proxy', true);
    this.application.use(express.static(configApp.path.public));
    this.application.use('/uploads', express.static(configApp.path.uploads));

    return (req: Request, res: Response, next: NextFunction) => {
      res.error = (err: any, status?: number) => {
        const message = err.message || err;

        res.statusCode = status || 400;
        res.json({ error: true, status, message });

        return res;
      };

      res.success = (data: any, status?: number) => {
        res.statusCode = status || 200;
        res.json({ error: false, status, ...data });

        return res;
      };

      next();
    };
  }
}
