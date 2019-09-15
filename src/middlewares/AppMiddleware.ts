/* eslint-disable no-unused-vars */
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ValidationError } from 'yup';

import Middleware from './Middleware';
import configApp from '../config/app';

export default class AppMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    this.application.set('trust proxy', true);
    this.application.use(express.static(configApp.path.public));
    this.application.use('/uploads', express.static(configApp.path.uploads));

    const dev = process.env.NODE_ENV === 'development';

    return (req: Request, res: Response, next: NextFunction) => {
      res.error = (err: any, status?: number) => {
        // eslint-disable-next-line no-console
        if (dev) console.error(err);

        const name = err.name || null;
        let message = err.message || err;
        let validators;

        if (err instanceof ValidationError && err.inner) {
          message = 'Falha nas validações.';
          validators = err.inner;
        }

        status = status || err.status || 400;
        res.status(status).json({ name, status, message, validators });

        return res;
      };

      res.success = (data: any, status?: number) => {
        status = status || res.statusCode || 200;
        res.status(status).json({ status, ...data });

        return res;
      };

      return next();
    };
  }
}
