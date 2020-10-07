module.exports = function (app) {
  const User = app.models.user;
  const RoleMapping = app.models.RoleMapping;

  User.updateUser = function (userId, userObject, cb) {
    User.findById(userId, function (err, user) {
      if (err) {
        cb(null, {
          success: false,
        });
      } else {
        user.updateAttributes(
          {
            username: userObject.username,
            email: userObject.email,
            temp_pass: userObject.temp_pass,
            active: userObject.active,
          },
          function (err, user) {
            if (err) {
              cb(null, {
                success: false,
              });
            } else {
              RoleMapping.destroyAll(
                {
                  principalType: "USER",
                  principalId: userId,
                },
                function (err, result) {
                  if (err) {
                    cb(null, {
                      success: false,
                    });
                  } else {
                    const roleInsertObjects = userObject.roles.map((roleId) => {
                      return {
                        principalType: "USER",
                        principalId: userId,
                        roleId: roleId,
                      };
                    });
                    RoleMapping.create(roleInsertObjects, function (
                      err,
                      result
                    ) {
                      if (err) {
                        cb(null, {
                          success: false,
                        });
                      } else {
                        cb(null, {
                          success: true,
                        });
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  };

  User.remoteMethod("updateUser", {
    accepts: [
      {
        arg: "userId",
        type: "number",
      },
      {
        arg: "userObject",
        type: "object",
      },
    ],
    returns: {
      arg: "response",
      type: "object",
      root: true,
    },
  });

  User.updatePassword = function (userId, password, cb) {
    User.findById(userId, function (err, user) {
      if (err) {
        cb(null, {
          success: false,
        });
      } else {
        user.updateAttribute("password", User.hashPassword(password), function (
          err,
          user
        ) {
          if (err) {
            cb(null, {
              success: false,
            });
          } else {
            cb(null, {
              succes: true,
            });
          }
        });
      }
    });
  };
  User.remoteMethod("updatePassword", {
    accepts: [
      {
        arg: "userId",
        type: "number",
      },
      {
        arg: "password",
        type: "string",
      },
    ],
    returns: {
      arg: "response",
      type: "object",
      root: true,
    },
  });

  // Add a login hook to make sure the user is active
  User.afterRemote("login", function (context, remoteMethodOutput, next) {
    const user = remoteMethodOutput.userId;
    User.findById(user, function (err, user) {
      if (!user.active) {
        context.res.status(401);
      }
      next();
    });
  });
};
