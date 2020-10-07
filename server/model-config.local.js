require('../config');

module.exports = {
  '_meta': {
    'sources': [
      'loopback/common/models',
      'loopback/server/models',
      '../common/models',
      './models',
    ],
    'mixins': [
      'loopback/common/mixins',
      'loopback/server/mixins',
      '../common/mixins',
      './mixins',
    ],
  },
  'AccessToken': {
    'dataSource': config.datasource,
    'public': false,
    "relations": {
      "user": {
        "type": "belongsTo",
        "model": "user",
        "foreignKey": "userId"
      }
    }
  },
  'ACL': {
    'dataSource': config.datasource,
    'public': true,
  },
  'RoleMapping': {
    'dataSource': config.datasource,
    'public': true,
    'options': {
      'strictObjectIDCoercion': true,
    },
  },
  'Role': {
    'dataSource': config.datasource,
    'public': true,
  },
  'user': {
    'dataSource': config.datasource,
    'public': true,
  },
  'activity': {
    'dataSource': config.datasource,
    'public': true,
  },
  'FilterData': {
    'dataSource': config.datasource,
    'public': true,
  },
  'widget': {
    'dataSource': config.datasource,
    'public': true,
  },
  'feedback': {
    'dataSource': config.datasource,
    'public': true,
  },
  'system-alerts': {
    'dataSource': config.datasource,
    'public': true,
  },
};
