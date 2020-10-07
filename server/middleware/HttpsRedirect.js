module.exports = {
  redirect: function() {
    return function(req, res, next) {
      // const isLocal = req.headers.host.indexOf('localhost') === 0;
      // if (!isLocal && !req.secure) {
      // res.redirect('https://' + req.headers.host + req.url);
      // } else {
      //   next();
      // }
      next();
    };
  },
};
