// eslint-disable-next-line no-unused-vars
import { RequestHandler, Request, Response, NextFunction } from 'express';
import Middleware from './Middleware';
import JwtService from '../services/JwtService';

export type TokenMiddlewareParams = { logged: boolean };

export default class TokenMiddleware extends Middleware {
  public dispatch({ logged }: TokenMiddlewareParams): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      let token;
      let status = 403;
      const decoded: { [key: string]: any } = {};

      const allowed: Array<string> = [];
      const method = req.method.toLowerCase();

      if (['options'].includes(method)) {
        return next();
      }

      if (allowed.includes(req.path)) {
        req.allowedRoute = true;
        return next();
      }

      try {
        const { authorization } = req.headers;

        if (!authorization) {
          token = req.query.token;

          if (!token) {
            throw new Error('Acesso negado.');
          }
        }

        if (!token) {
          [, token] = authorization.split(' ');
        }

        try {
          (decoded as {}) = await JwtService.decode(token.trim());
        } catch (err) {
          if (process.env.API_KEY !== token) {
            throw err;
          }
        }

        // Verifica id no token
        if (!decoded.id && logged) {
          status = 401;
        }

        req.user = { ...decoded };

        return next();
      } catch (err) {
        return res.error(err, status);
      }
    };
  }
}
