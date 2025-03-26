module.exports = {
    apps: [{
      name: 'koala',
      script: './dist/app.js',
      instances: 1,
      watch: false,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
    }]
  };
