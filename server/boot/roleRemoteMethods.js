module.exports = function(app) {
  const Role = app.models.Role;

  Role.updateRoleName = function(roleId, newName, cb) {
    Role.findById(roleId, function(err, role) {
      if (err) {
        cb(null, {
          success: false,
        });
      } else {
        role.updateAttributes(
          {
            name: newName,
          },
          function(err, role) {
            if (err) {
              cb(null, {
                success: false,
              });
            } else {
              cb(null, {
                success: true,
              });
            }
          }
        );
      }
    });
  };

  Role.remoteMethod('updateRoleName', {
    accepts: [
      {
        arg: 'roleId',
        // type: 'number',
      },
      {
        arg: 'newName',
        type: 'string',
      },
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true,
    },
  });
};
