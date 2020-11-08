const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1/weather',
    createProxyMiddleware({
      target: 'https://www.metaweather.com/api',
      changeOrigin: true,
    })
  );
};