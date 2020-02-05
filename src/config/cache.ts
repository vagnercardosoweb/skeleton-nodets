import { Cache } from '../lib';
import configRedis from './redis';

export default new Cache({
  ...configRedis,
  keyPrefix: 'cache:',
});
