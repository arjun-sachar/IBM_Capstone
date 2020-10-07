require("../../config");
const datasourceName = config.datasource;

module.exports = function (app) {
  function createBuiltInModels() {
    return new Promise((resolve, reject) => {
      try {
        app.dataSources[datasourceName].autoupdate(
          ["user", "AccessToken", "ACL", "RoleMapping", "Role"],
          function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(null);
          }
        );
      } catch (e) {
        console.error(e);
        resolve(null);
      }
    });
  }

  function autoUpdateDB() {
    const ds = app.dataSources[datasourceName];

    return new Promise((resolve, reject) => {
      try {
        ds.autoupdate(function () {
          console.log("Database is up to date");
          resolve(null);
        });
      } catch (e) {
        console.error(e);
        resolve(null);
      }
    });
  }

  function createWidgetData() {
    const Widget = app.models.Widget;

    Widget.create({
      name: "Widget 1",
      organization: "IBM",
    });
    Widget.create({
      name: "Widget 2",
      organization: "IBM",
    });
    Widget.create({
      name: "Widget 3",
      organization: "IBM",
    });
    Widget.create({
      name: "Widget 4",
      organization: "FooBar Inc.",
    });
    Widget.create({
      name: "Widget 5",
      organization: "FooBar Inc.",
    });
    Widget.create({
      name: "Widget 6",
      organization: "FizzBuzz LLC.",
    });
    Widget.create({
      name: "Widget 7",
      organization: "FizzBuzz LLC.",
    });
    Widget.create({
      name: "Widget 8",
      organization: "FizzBuzz LLC.",
    });
    Widget.create({
      name: "Widget 9",
      organization: "XYZ Inc.",
    });
    Widget.create({
      name: "Widget 10",
      organization: "XYZ Inc.",
    });
  }

  function createAdminUserAndRole() {
    return new Promise((resolve, reject) => {
      app.models.user.findOrCreate(
        {
          username: "IBM_Admin",
        },
        {
          username: "IBM_Admin",
          email: "admin@ibm.com",
          password: "ibm_admin123",
          apikey: "123456",
          temp_pass: false,
        },
        (err, user) => {
          if (err) {
            // User exists
            reject(err);
            return;
          }
          app.models.Role.findOrCreate(
            {
              name: "admin",
            },
            {
              name: "admin",
            },
            function (err, role) {
              if (user) {
                role.principals.findOne(
                  {
                    where: {
                      principalId: user.id,
                      principalType: app.models.RoleMapping.USER,
                    },
                  },
                  function (err, principal) {
                    if (!principal) {
                      role.principals.create(
                        {
                          principalType: app.models.RoleMapping.USER,
                          principalId: user.id,
                        },
                        function (err, principal) {
                          resolve({
                            user,
                            role,
                          });
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    });
  }

  function createTestUsers() {
    return new Promise((resolve, reject) => {
      app.models.user.create(
        [
          {
            username: "Joe Johnson",
            email: "joe.johnson@gmail.com",
            password: "joe_johnson123",
            apikey: "1234567",
            temp_pass: false,
          },
          {
            username: "Steve Doe",
            email: "steve.doe@gmail.com",
            password: "steve_doe123",
            apikey: "12345678",
            temp_pass: false,
          },
          {
            username: "Mary Smith",
            email: "mary.smith@gmail.com",
            password: "mary_smith123",
            apikey: "123456789",
            temp_pass: false,
          },
        ],
        (err, users) => {
          if (err) {
            reject(err);
            return;
          }

          app.models.Role.create(
            {
              name: "user",
            },
            function (err, role) {
              if (err) {
                reject(err);
                return;
              }

              const promises = [];

              users.forEach((user) => {
                promises.push(
                  new Promise((_resolve, _reject) => {
                    role.principals.create(
                      {
                        principalType: app.models.RoleMapping.USER,
                        principalId: user.id,
                      },
                      function (err, principal) {
                        if (err) {
                          _reject(err);
                          return;
                        }
                        _resolve(principal);
                      }
                    );
                  })
                );
              });

              Promise.all(promises)
                .then(() => {
                  resolve({
                    users,
                    role,
                  });
                })
                .catch((err) => {
                  reject(err);
                });
            }
          );
        }
      );
    });
  }

  // create all models
  createBuiltInModels().then(() => {
    autoUpdateDB().then(() => {
      createAdminUserAndRole().then(() => {
        createTestUsers();
        createWidgetData();
      });
    });
  });
};
