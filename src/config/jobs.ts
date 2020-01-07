import * as jobs from '../jobs';
import Queue from '../lib/Queue';
import configRedis from './redis';

export default new Queue({
  jobs: Object.values(jobs),
  bullOptions: {
    redis: configRedis,
  },
});
