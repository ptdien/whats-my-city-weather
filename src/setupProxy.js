const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/location',
    createProxyMiddleware({
      target: 'https://www.metaweather.com/api/location',
      changeOrigin: true,
    })
  );
};