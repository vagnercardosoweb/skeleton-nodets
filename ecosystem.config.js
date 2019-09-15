module.exports = {
  apps: [
    {
      name: 'nodets',
      script: './dist/server.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: 0,
      exec_mode: 'cluster',
      watch: true,
      merge_logs: true,
      autorestart: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
