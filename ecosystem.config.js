module.exports = {
  apps: [
    {
      name: 'vcwebnetworks-nodets',
      script: './dist/server.js',

      // Options reference: http://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      instances: 0,
      exec_mode: 'cluster',
      watch: process.env.NOD_ENV === 'development',
      merge_logs: true,
      autorestart: true,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
