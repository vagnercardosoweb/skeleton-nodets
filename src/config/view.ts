import { resolve } from 'path';

export default {
  enable: true,
  engine: 'twig', // twig || nunjucks (njk)
  path: resolve(__dirname, '..', '..', 'views'),
  options: {},
  functions: {
    toUpperCase(value: string): string {
      return value.toUpperCase();
    },
  },
  filters: {
    toUpperCase(value: string): string {
      return value.toUpperCase();
    },
  },
};
