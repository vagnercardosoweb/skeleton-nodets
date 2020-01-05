// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction, RequestHandler } from 'express';

import configCors from '../config/cors';

export default function CorsMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const { methods, headers, origin } = configCors;

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', methods.join(','));
    res.header('Access-Control-Allow-Headers', headers.join(','));

    if (String(req.method).toUpperCase() === 'OPTIONS') {
      return res.sendStatus(200);
    }

    return next();
  };
}
