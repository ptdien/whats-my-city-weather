const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/location",
    createProxyMiddleware({
      // metaweather.com forgets to send cors response on some endpoints. Bug?
      target: "https://meta-weather.now.sh/api",
      changeOrigin: true,
    })
  );
};
