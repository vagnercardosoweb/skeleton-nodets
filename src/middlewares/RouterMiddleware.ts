import Middleware from './Middleware';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export default class RouterMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      let error = {
        status: 404,
        message: 'Error 404 (Not Found)',
        method: req.method,
        originalMethod: req.originalMethod || null,
        path: req.path,
        originalUrl: req.originalUrl,
        // cookies: req.cookies,
        // headers: req.headers,
        // params: req.params,
        // query: req.query,
        // body: req.body,
      };

      // Method override
      if (
        req.originalMethod !== undefined &&
        req.originalMethod !== req.method
      ) {
        error = {
          ...error,
          status: 405,
          message: 'Error 405 (Method Not Allowed)',
        };
      }

      // New status
      res.status(error.status || 404);

      // Help for regular expression of api error return
      let { path } = req;
      if (path[path.length - 1] !== '/') {
        path = `${path}/`;
      }

      // Response JSON
      if (req.xhr || path.match(/^\/api\//i)) {
        return res.json({ error });
      }

      // Response HTML
      return res.render(`error/${res.statusCode}`, { error });
    };
  }
}
