'use strict';
const path = require('path');
module.exports = function() {
  return function customRaiseUrlNotFoundError(req, res, next) {
    const pathToIndex = path.join(
      __dirname,
      '..',
      '..',
      'client',
      'dist',
      'index.html'
    );
    res.sendFile(pathToIndex, function(err) {
      if (err) {
        console.error(err);
        res.status(err.status).end();
      }
    });
  };
};
