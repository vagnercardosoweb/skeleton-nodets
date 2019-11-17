import configApp from './app';

export default {
  enable: true,
  engine: 'twig', // twig || nunjucks (njk)
  path: configApp.path.views,
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
