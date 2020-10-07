



const request = require('request');

const {getToken, generateExternalRoute} = require('../api-utils.js');

const EXTERNAL_URL = 'https://www.loc.gov/search/?q=%3csearchterm%3e&fo=json';

module.exports = function(app) {
  app.get('/api/data', (req, res) => {
      const options = {
        url: EXTERNAL_URL, 
      };

      request(options, function(error, response, body) {
        try {
          res.json(JSON.parse(body));
        } catch (e) {
          res.status(500);
          res.json({error: e});
        }
      });
  });

  // ... or you can use this helper function to generate the route for you
  generateExternalRoute(app, '/api/foobar', EXTERNAL_URL);
};
 