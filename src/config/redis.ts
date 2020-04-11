// eslint-disable-next-line no-unused-vars
import { RedisOptions } from 'ioredis';

const config: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export default config;
