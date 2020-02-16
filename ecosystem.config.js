const __DEV__ = process.env.NOD_ENV === 'development';

module.exports = {
  apps: [
    {
      name: '@vagnercardoso/server',
      script: './src/server.js',
      watch: __DEV__,
      merge_logs: true,
      autorestart: __DEV__,
      env: { NODE_ENV: 'production' },
      env_production: { NODE_ENV: 'production' },
    },
    {
      name: '@vagnercardoso/queues',
      script: './src/queues.js',
      watch: __DEV__,
      merge_logs: true,
      autorestart: __DEV__,
      env: { NODE_ENV: 'production' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
