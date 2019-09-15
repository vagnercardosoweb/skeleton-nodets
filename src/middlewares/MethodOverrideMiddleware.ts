// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Middleware from './Middleware';

export default class MethodOverrideMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      const originalMethod = req.originalMethod || req.method;
      let newMethod;

      // Checks whether the method is allowed
      if (!allowedMethods.includes(originalMethod)) {
        return next();
      }

      // Recover the custom method in the body
      if (req.body && typeof req.body === 'object') {
        ['_method', '_METHOD'].forEach(method => {
          if (typeof req.body[method] !== 'undefined') {
            newMethod = req.body[method];
            delete req.body[method];
          }
        });
      }

      // Recover in header if you have not found
      if (!newMethod) {
        let header: string = 'X-HTTP-Method-Override';
        header = <any>req.headers[header.toLowerCase()];

        if (!header) {
          return next();
        }

        // Multiple headers
        const index = header.indexOf(',');

        newMethod =
          index !== -1 ? header.substr(0, index).trim() : header.trim();
      }

      // Assigns the new method
      if (newMethod) {
        req.originalMethod = originalMethod;
        req.method = newMethod.toUpperCase();
      }

      return next();
    };
  }
}
