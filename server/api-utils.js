const request = require('request');

// TODO Add to config file
const EXTERNAL_URL = 'http://localhost:5000';

const uuid = require('uuid/v4');

// Injects req.params.<param> into a route string
// Example: '/api/candidates/:candidate_id/jobs/:job_id' => `/api/candidates/${req.params.candidate_id}/jobs/${req.params.job_id}`
const injectParams = function(route, params) {
  return route.split('/').map((routeSection) => {
    if (routeSection.length === 0) {
      return '';
    }
    if (routeSection[0] === ':') {
      return params[routeSection.substr(1)];
    } else {
      return routeSection;
    }
  }).join('/');
};

const getToken = function(user) {
  // Commented out code is an example of how to get an access token from the
  // external source

  return new Promise(function(resolve, reject) {
    // request(EXTERNAL_URL + '/api/get-auth-token', function(error, response, body) {
    //   if (error) {
    //     reject(error);
    //   } else {
    //     try {
    //       const token = JSON.parse(body).token;
    //       resolve(token);
    //     } catch (e) {
    //       reject(e);
    //     }
    //   }
    // });
    const token = 'abcdef';
    resolve(token);
  });
};

module.exports = {
  getToken: getToken,

  generateUniqueID: function() {
    return uuid();
  },

  generateExternalRoute: function(app, route, externalBaseURL, options) {
    if (externalBaseURL === undefined) {
      externalBaseURL = '';
    }
    if (options === undefined) {
      options = {};
    }
    const method = options.method || 'get';
    const auth = options.auth || true;
    app[method](route, (req, res) => {
      const externalRoute = options.externalRoute || injectParams(route, req.params);
      const authFunction = auth ? getToken.bind(this, req) : () => {
        return new Promise((resolve) => {
          resolve('');
        });
      };

      authFunction().then((token) => {
        const headers = options.headers || {};
        headers['Authentication'] = token;
        const httpOptions = {
          url: externalBaseURL + externalRoute,
          headers: headers,
        };

        request(httpOptions, function(error, response, body) {
          try {
            res.json(JSON.parse(body));
          } catch (e) {
            res.status(500);
            res.json({error: e});
          }
        });
      });
    });
  }
};
