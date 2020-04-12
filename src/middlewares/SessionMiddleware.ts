// eslint-disable-next-line no-unused-vars
import connectRedis from 'connect-redis';
import expressSession from 'express-session';
import Redis from 'ioredis';

import configRedis from '../config/redis';
import configSession from '../config/session';

const client = new Redis({ ...configRedis });
// @ts-ignore
const store = new (connectRedis(expressSession))({ client });

export default expressSession({ store, ...configSession });
