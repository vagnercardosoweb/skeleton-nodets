import * as jobs from '../jobs';
import { Queue } from '../lib';
import configRedis from './redis';

export default new Queue({
  jobs: Object.values(jobs),
  bullOptions: {
    redis: {
      ...configRedis,
      keyPrefix: 'jobs:',
    },
  },
});
