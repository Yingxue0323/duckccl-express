export default {
    apps: [{
      name: 'koala',
      script: 'dist/app.ts',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };
