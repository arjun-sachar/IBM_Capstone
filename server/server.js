"use strict";
const path = require("path");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv-flow").config({
  path: path.join(__dirname, ".."),
});
const loopback = require("loopback");
const boot = require("loopback-boot");
const app = (module.exports = loopback());
const fileUpload = require("express-fileupload");
const https = require("https");

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit("started");
    const baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
    if (app.get("loopback-component-explorer")) {
      const explorerPath = app.get("loopback-component-explorer").mountPath;
      console.log("Browse your REST API at %s%s", baseUrl, explorerPath);
    }
  });
};

app.use(fileUpload());

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});
