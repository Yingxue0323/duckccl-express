module.exports = {
    apps: [{
      name: 'koala',
      script: './dist/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      max_restarts: 5,          // limit max restarts
      merge_logs: true,
    }]
  };
