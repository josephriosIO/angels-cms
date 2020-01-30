const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/*',
    proxy({
      target: 'https://menschempoweredvc.herokuapp.com/',
      changeOrigin: true,
      logLevel: 'debug',
      router: {
        'localhost:3000': 'http://localhost:3001',
      },
    }),
  );
};
