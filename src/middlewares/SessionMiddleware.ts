import Middleware from './Middleware';
import { RequestHandler } from 'express';
import ExpressSession from 'express-session';
import ConnectRedis from 'connect-redis';

import configRedis from '../config/redis';
import configSession from '../config/session';

export default class SessionMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    const store = new (ConnectRedis(ExpressSession))(configRedis);

    return ExpressSession({
      store,
      ...configSession,
    });
  }
}
