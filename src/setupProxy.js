const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/location",
    createProxyMiddleware({
      target: "https://www.metaweather.com/api",
      changeOrigin: true,
    })
  );
  app.use(
    "/forecast",
    createProxyMiddleware({
      target: `http://www.7timer.info/bin/api.pl`,
      changeOrigin: true,
      pathRewrite: {
        "^/forecast": "",
      }
    })
  );
};
