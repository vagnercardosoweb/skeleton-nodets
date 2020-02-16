// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, RequestHandler, Response } from 'express';

import configApp from '../config/app';
import { ResponseError } from '../erros';
import { Jwt } from '../lib';

export default (): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    let [, token] = (req.headers.authorization || '').split(' ');

    if (!token) {
      token = req.query.token;

      if (!token) {
        throw new ResponseError({
          status: 403,
          message: 'Access blocked.',
        });
      }
    }

    try {
      (decoded as {}) = await Jwt.decode(token.trim(), configApp.key);

      req.userId = decoded.id;
      req.userToken = token;
    } catch (error) {
      if (process.env.API_KEY !== token) {
        throw new ResponseError({
          status: 401,
          message: 'Access denied.',
          error,
        });
      }
    }

    return next();
  } catch (err) {
    return res.error(err);
  }
};
