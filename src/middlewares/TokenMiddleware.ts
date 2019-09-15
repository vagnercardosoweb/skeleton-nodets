// eslint-disable-next-line no-unused-vars
import { RequestHandler, Request, Response, NextFunction } from 'express';
import Middleware from './Middleware';
import JwtService from '../services/JwtService';

export type TokenMiddlewareParams = { logged: boolean };

export default class TokenMiddleware extends Middleware {
  public dispatch({ logged }: TokenMiddlewareParams): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      const row = {};
      const method = req.method.toLowerCase();

      let token;
      let status = 403;
      let decoded: { [key: string]: any } | string = {};

      if (['options'].includes(method)) {
        return next();
      }

      try {
        const header = req.headers.authorization;

        if (!header) {
          token = req.query.token;

          if (!token) {
            throw new Error('Acesso negado.');
          }
        }

        if (!token) {
          [, token] = header.split(' ');
        }

        try {
          decoded = await JwtService.decode(token.trim());
        } catch (err) {
          if (process.env.API_KEY !== token) {
            throw err;
          }
        }

        // Check login
        if (logged === true) {
          status = 401;
        }

        req.auth = {
          ...(decoded as {}),
          ...row,
        };

        return next();
      } catch (err) {
        return res.error(err, status);
      }
    };
  }
}
