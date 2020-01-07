const __DEV__ = process.env.NOD_ENV === 'development';

module.exports = {
  apps: [
    {
      name: '@vagnercardoso/skeleton-express',
      script: './dist/server.js',
      watch: __DEV__,
      merge_logs: true,
      autorestart: __DEV__,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
    {
      name: '@vagnercardoso/skeleton-queues',
      script: './dist/queues.js',
      watch: __DEV__,
      merge_logs: true,
      autorestart: __DEV__,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
