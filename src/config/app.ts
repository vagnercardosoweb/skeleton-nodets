import { resolve } from 'path';

const tmp = resolve(__dirname, '..', '..', 'tmp');

export default {
  key: process.env.APP_KEY || 'VCWebNetworks',
  apiKey: process.env.API_KEY || 'VCWebNetworks',

  path: {
    tmp,
    public: resolve(tmp, '..', 'public'),
    uploads: resolve(tmp, 'uploads'),
  },
};
