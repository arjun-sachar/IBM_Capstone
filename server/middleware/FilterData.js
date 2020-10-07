module.exports = {
  filter: function() {
    return function(req, res, next) {
      const RoleMapping = req.app.models.RoleMapping;
      const FilterData = req.app.models.FilterData;

      const models = req.app.models();

      models.forEach((model) => {
        model.defaultScope = function() {};
      });

      FilterData.find({}, function(err, filterData) {
        if (err) {
          next();
        } else {
          function _filterData() {
            // Only get filterData that applies to the current user
            filterData = filterData.filter((fd) => {
              return (
                (fd.authCategory === 'USER' && userId) ||
                (fd.authCategory === 'ROLE' && roleIds.indexOf(fd.authId) > -1)
              );
            });

            // Group 'filterData' response by model
            const filterDataByModel = {};
            filterData.forEach((filterDataObj) => {
              if (!filterDataByModel[filterDataObj.relatedModel]) {
                filterDataByModel[filterDataObj.relatedModel] = [];
              }
              filterDataByModel[filterDataObj.relatedModel].push(filterDataObj);
            });

            // Set the defaultScope function for each model
            Object.keys(filterDataByModel).forEach((filterDataModel) => {
              const Model = req.app.models[filterDataModel];

              const defaultScopeObject = {};
              let limitValue = null;
              const whereObject = {};

              filterDataByModel[filterDataModel].forEach((filterDataObj) => {
                if (filterDataObj.filterType === 'where') {
                  if (whereObject[filterDataObj.foreignField] === undefined) {
                    whereObject[filterDataObj.foreignField] = {
                      inq: [],
                      nin: [],
                    };
                  }
                  if (filterDataObj.compareOperator === '=') {
                    whereObject[filterDataObj.foreignField].inq.push(
                      filterDataObj.compareValue
                    );
                  } else if (filterDataObj.compareOperator === '!=') {
                    whereObject[filterDataObj.foreignField].nin.push(
                      filterDataObj.compareValue
                    );
                  } else if (filterDataObj.compareOperator === 'matches') {
                    whereObject[filterDataObj.foreignField].regexp =
                      filterDataObj.compareValue;
                  }
                } else if (filterDataObj.filterType === 'limit') {
                  limitValue = filterDataObj.compareValue;
                }
              });

              if (Object.keys(whereObject).length > 0) {
                Object.keys(whereObject).forEach((key) => {
                  Object.keys(whereObject[key]).forEach((sk) => {
                    if (whereObject[key][sk].length==0) {
                      delete whereObject[key][sk];
                    }
                  });
                });
                defaultScopeObject['where'] = whereObject;
              }

              if (limitValue != null) {
                defaultScopeObject['limit'] = limitValue;
              }

              Model.originalScope = Model.defaultScope;

              Model.defaultScope = function() {
                return defaultScopeObject;
              };
            });
            next();
          }

          const accessToken = req.accessToken;
          let userId = null;
          let roleIds = [];
          if (accessToken) {
            userId = accessToken.userId;
          }

          if (userId != null) {
            RoleMapping.find(
              {
                where: {
                  principalType: 'USER',
                  principalId: userId,
                },
              },
              function(err, roleMappings) {
                roleIds = roleMappings.map((roleMapping) => {
                  return roleMapping.roleId;
                });
                _filterData();
              }
            );
          } else {
            // FilterData only works for authenticated users
            next();
          }
        }
      });
    };
  },
};
