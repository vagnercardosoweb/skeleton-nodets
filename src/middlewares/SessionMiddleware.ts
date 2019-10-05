// eslint-disable-next-line no-unused-vars
import { RequestHandler } from 'express';
import redis from 'redis';
import ExpressSession from 'express-session';
import ConnectRedis from 'connect-redis';

import Middleware from './Middleware';

import configRedis from '../config/redis';
import configSession from '../config/session';

export default class SessionMiddleware extends Middleware {
  public dispatch(): RequestHandler {
    const client = redis.createClient(configRedis);
    const store = new (ConnectRedis(ExpressSession))({ client });

    return ExpressSession({
      store,
      ...configSession,
    });
  }
}
