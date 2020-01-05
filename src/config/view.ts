import { resolve } from 'path';

import configApp from './app';

const path = resolve(configApp.path.root, 'views');

export default {
  path,
  nujunks: {
    filters: {
      toUpperCase(value: string): string {
        return value.toUpperCase();
      },
    },
  },
};
