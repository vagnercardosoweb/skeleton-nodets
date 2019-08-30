import { resolve } from 'path';

const tmpPath = resolve(__dirname, '..', '..', 'tmp');

export default {
  key: process.env.APP_KEY || 'VCWebNetworks',
  apiKey: process.env.API_KEY || 'VCWebNetworks',

  path: {
    tmp: tmpPath,
    public: resolve(__dirname, '..', '..', 'public'),
    uploads: resolve(tmpPath, 'uploads'),
  },
};
