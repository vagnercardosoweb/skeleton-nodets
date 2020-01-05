import * as Sentry from '@sentry/node';
// eslint-disable-next-line no-unused-vars
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import Youch from 'youch';

// eslint-disable-next-line no-unused-vars
import { IApp } from '../app';
import configApp from '../config/app';
import configSentry from '../config/sentry';

export default function ErrorMiddleware(app: IApp): ErrorRequestHandler {
  if (configSentry.dsn && process.env.NODE_ENV === 'production') {
    app.app.use(Sentry.Handlers.errorHandler());
  }

  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    res.statusCode = err.status || 500;

    if (process.env.NODE_ENV !== 'production') {
      const youch = new Youch(err, req);

      if (configApp.onlyApi || req.xhr || req.path.match(/^\/api\/?/i)) {
        return res.send(await youch.toJSON());
      }

      return res.send(await youch.toHTML());
    }

    return res.error({
      error: err,
      sentry: res.sentry,
      message: 'Internal Server Error.',
    });
  };
}
