// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, RequestHandler } from 'express';

import configCors from '../config/cors';

export default function MethodOverrideMiddleware(): RequestHandler {
  return (req: Request, _: Response, next: NextFunction) => {
    const allowedMethods = configCors.methods;
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
      const header = <any>req.headers['x-http-method-override'];

      if (!header) {
        return next();
      }

      // Multiple methods
      const index = header.indexOf(',');
      newMethod = index !== -1 ? header.substr(0, index).trim() : header.trim();
    }

    // Assigns the new method
    if (newMethod) {
      req.method = newMethod.toUpperCase();
      req.originalMethod = originalMethod;
    }

    return next();
  };
}
