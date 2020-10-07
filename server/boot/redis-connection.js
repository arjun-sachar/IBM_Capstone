const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
require('../../config');

module.exports = function(app) {
  if (config.server.connections.session.active) {
    const client = redis.createClient(
      config.server.connections.session.port,
      config.server.connections.session.uri,
      {
        auth_pass: config.server.connections.session.pass,
        tls: {
          servername: config.server.connections.session.uri,
        },
      }
    );
    app.use(session({
      secret: config.server.connections.session.secret_key,
      // create new redis store.
      store: new RedisStore({client: client}),
      saveUninitialized: true,
      resave: true,
      cookie: {maxAge: 1000*60*config.server.connections.session.cookie_age},
    }));
  }
};
