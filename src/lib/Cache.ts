// eslint-disable-next-line no-unused-vars
import IORedis, { Redis } from 'ioredis';

import configRedis from '../config/redis';

class Cache {
  redis: Redis;
  prefix: string;

  constructor() {
    this.prefix = 'cache:';
    this.redis = new IORedis({
      port: configRedis.port,
      host: configRedis.host,
      keyPrefix: this.prefix,
    });
  }

  set(
    key: IORedis.KeyType,
    value: IORedis.ValueType,
    expiredSeconds?: number | string
  ): Promise<string> {
    if (value) {
      value = JSON.stringify(value);
    }

    if (expiredSeconds) {
      return this.redis.set(key, value, 'EX', expiredSeconds);
    }

    return this.redis.set(key, value);
  }

  async get(key: IORedis.KeyType): Promise<any> {
    const data = await this.redis.get(key);

    return data ? JSON.parse(data) : null;
  }

  async exists(key: IORedis.KeyType): Promise<number> {
    return this.redis.exists(key);
  }

  delete(key: IORedis.KeyType): Promise<number> {
    return this.redis.del(key);
  }

  async deletePrefix(prefix: string): Promise<number> {
    const keys = await this.redis.keys(`${this.prefix}${prefix}:*`);
    const keysNotPrefix = keys.map(key => key.replace(this.prefix, ''));

    return this.redis.del(...keysNotPrefix);
  }
}

export default new Cache();
