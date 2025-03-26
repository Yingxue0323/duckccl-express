module.exports = {
    apps: [{
      name: 'koala',
      script: './dist/app.js',
      instances: 2,
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 60000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      max_restarts: 5,          // limit max restarts
      restart_delay: 4000,
      error_file: '/var/www/logs/koala-error.log',
      out_file: '/var/www/logs/koala-out.log',
      merge_logs: true,
    }]
  };
