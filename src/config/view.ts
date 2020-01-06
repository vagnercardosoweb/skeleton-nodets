import { resolve } from 'path';

import configApp from './app';

export default {
  path: resolve(configApp.path.root, 'views'),
  nujunks: {
    filters: {
      toUpperCase(value: string): string {
        return value.toUpperCase();
      },
    },
  },
};
