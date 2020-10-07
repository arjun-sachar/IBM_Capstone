config = {
  server: {
    application: {
      base_url: "dashblocksV2",
    },
    connections: {
      session: {
        active: false,
        port: 0,
        uri: "localhost",
        password: "pass",
        secret_key: "key123",
        cookie_age: 10, // time in minutes for redis session to expire
      },
    },
    queue: {},
    flask: {},
  },
  client: {
    session: {
      expiration: 1800, // time in seconds for login token to expire
    },
  },

  // Set in .env
  datasource: process.env.DATASOURCE || "db",
};
