// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

import configApp from '../config/app';
import { renderView } from '../helpers';

export default (req: Request, res: Response): Response => {
  let error = {
    status: 404,
    message: 'Error 404 (Not Found)',
    method: req.method,
    originalMethod: req.originalMethod || null,
    path: req.path,
    originalUrl: req.originalUrl,
  };

  // In development
  if (process.env.NODE_ENV === 'development') {
    (<any>error) = {
      ...error,
      cookies: req.cookies,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
    };
  }

  // Method override
  if (req.originalMethod !== undefined && req.originalMethod !== req.method) {
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

  // Response html
  if (configApp.onlyApi || req.xhr || path.match(/^\/api\/?/i)) {
    return res.json(error);
  }

  return res.send(renderView(`errors/${res.statusCode}`, error));
};
