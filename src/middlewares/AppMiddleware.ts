/* eslint-disable no-unused-vars */
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ValidationError as ValidationErrorSequelize } from 'sequelize';
import { ValidationError as ValidationErrorYup } from 'yup';

import { IApp } from '../app';
import configApp from '../config/app';
import { createRandomInt } from '../helpers';

export default (app: IApp): RequestHandler => {
  const __DEV__ = process.env.NODE_ENV === 'development';

  app.app.set('trust proxy', true);
  app.app.set('x-powered-by', false);

  if (configApp?.path?.public) {
    app.app.use(express.static(configApp.path.public));
  }

  if (configApp?.path?.uploads) {
    app.app.use('/uploads', express.static(configApp.path.uploads));
  }

  return (_: Request, res: Response, next: NextFunction) => {
    res.error = (err: any, status?: number) => {
      // eslint-disable-next-line no-console
      if (__DEV__) console.error(err);

      status = <number>(err?.status || status || 400);

      const name = err?.name || null;
      const description = err?.description || null;
      const errorIndex = (len: number) => createRandomInt(0, len);

      let i;
      let message = err?.message || null;
      let details = null;

      if (err instanceof ValidationErrorYup && err.inner) {
        i = errorIndex(err.inner.length);
        message = err.inner[i].message;
        details = err.inner;
      }

      if (err instanceof ValidationErrorSequelize && err.errors) {
        i = errorIndex(err.errors.length);
        message = err.errors[i].message;
        details = err.errors;
      }

      res.status(status).json({
        error: {
          status,
          name,
          message,
          description,
          details,
        },
      });

      return res;
    };

    res.success = (data: any = {}, status?: number) => {
      status = status || res.statusCode || 200;

      res.status(status).json({
        error: null,
        status,
        ...data,
      });

      return res;
    };

    return next();
  };
};
