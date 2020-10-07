module.exports = function(app) {
  const ACL = app.models.ACL;

  ACL.updateRoleACLs = function(role, checkedACLs, cb) {
    const keySeparator = '-|-';

    ACL.destroyAll(
      {
        principalType: 'ROLE',
        principalId: role,
      },
      function(err, response) {
        if (err) {
          cb(null, {
            success: false,
          });
        } else {
          const checkedPermissions = checkedACLs.checked;
          const uncheckedPermissions = checkedACLs.unchecked;

          checkedPermissions.forEach((permissionString) => {
            const splitPermissionString = permissionString.split(keySeparator);

            const modelName = splitPermissionString[0];
            const propertyName = splitPermissionString[1];

            ACL.create({
              model: modelName,
              property: propertyName,
              principalType: 'ROLE',
              principalId: role,
              accessType: '*',
              permission: 'ALLOW',
            });
          });

          uncheckedPermissions.forEach((permissionString) => {
            const splitPermissionString = permissionString.split(keySeparator);

            const modelName = splitPermissionString[0];
            const propertyName = splitPermissionString[1];

            // ACL.create({
            //   model: modelName,
            //   property: propertyName,
            //   principalType: 'ROLE',
            //   principalId: role,
            //   accessType: "*",
            //   permission: 'DENY'
            // });
          });

          cb(null, {
            success: true,
          });
        }
      }
    );
  };

  ACL.remoteMethod('updateRoleACLs', {
    accepts: [
      {
        arg: 'role',
        type: 'string',
      },
      {
        arg: 'checkedACLs',
        type: 'object',
      },
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true,
    },
  });
};
