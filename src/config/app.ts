import { resolve } from 'path';

const rootPath = resolve(__dirname, '..', '..');

export default {
  key: process.env.APP_KEY || 'VCWebNetworks',
  apiKey: process.env.API_KEY || 'VCWebNetworks',

  jwtExpiresIn: '7d',

  path: {
    tmp: resolve(rootPath, 'tmp'),
    views: resolve(rootPath, 'views'),
    public: resolve(rootPath, 'public'),
    uploads: resolve(rootPath, 'tmp', 'uploads'),
  },
};
