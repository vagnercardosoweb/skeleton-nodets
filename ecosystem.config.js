const __DEV__ = process.env.NOD_ENV === 'development';

module.exports = {
  apps: [
    {
      name: '@vagnercardoso/skeleton-express',
      script: './dist/server.js',

      // Options reference: http://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      instances: 0,
      exec_mode: 'cluster',
      watch: __DEV__,
      merge_logs: true,
      autorestart: __DEV__,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
