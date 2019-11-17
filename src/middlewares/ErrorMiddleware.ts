// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import Middleware from './Middleware';

import configSentry from '../config/sentry';

export default class AppMiddleware extends Middleware {
  public dispatch(): ErrorRequestHandler {
    if (configSentry.dsn && process.env.NODE_ENV === 'production') {
      this.application.use(Sentry.Handlers.errorHandler());
    }

    return async (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      res.statusCode = err.status || 500;

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req);

        if (req.xhr || req.path.match(/^\/api\/?/i)) {
          return res.send(await youch.toJSON());
        }

        return res.send(await youch.toHTML());
      }

      return res.error({
        sentry: res.sentry,
        message: 'Internal Server Error.',
      });
    };
  }
}
