/* eslint-disable no-unused-vars */
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ValidationError } from 'yup';

import { IApp } from '../app';
import configApp from '../config/app';

export default function AppMiddleware(app: IApp): RequestHandler {
  const __DEV__ = process.env.NODE_ENV === 'development';

  app.app.set('trust proxy', true);
  app.app.set('x-powered-by', false);
  app.app.use(express.static(configApp.path.public));
  app.app.use('/uploads', express.static(configApp.path.uploads));

  return (_: Request, res: Response, next: NextFunction) => {
    res.error = (err: any, status?: number) => {
      // eslint-disable-next-line no-console
      if (__DEV__) console.error(err);

      const name = err.name || null;
      let message = err.message || err;
      let validators;

      if (err instanceof ValidationError && err.inner) {
        message = err.errors[Math.floor(Math.random() * err.errors.length)];
        validators = err.inner;
      }

      status = <number>(status || err.status || 400);
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
