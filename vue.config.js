const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javasciptEnabled: true,
        }
      },
    },
  },
  productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "client", "src"),
      },
    },
  },
};
