// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';

import configApp from '../config/app';
import { Jwt } from '../lib';

export default async (req: Request, res: Response, next: NextFunction) => {
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
    let [, token] = (req.headers.authorization as string).split(' ');

    if (!token) {
      token = req.query.token;

      if (!token) {
        throw new Error('Invalid token.');
      }
    }

    try {
      (decoded as {}) = await Jwt.decode(token.trim(), configApp.key);
    } catch (err) {
      if (process.env.API_KEY !== token) {
        status = 401;
        throw err;
      }
    }

    // req.user = { ...decoded };

    return next();
  } catch (err) {
    return res.error(err, status);
  }
};
