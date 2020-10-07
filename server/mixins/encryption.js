const crypto = require('crypto');

module.exports = function(Model, options) {
  const defaultOpt = {
    'fields': [],

    //
    // Use https://asecuritysite.com/encryption/keygen to
    // fill out these values
    //
    'password': '',
    'salt': '',
    'hexIv': '',
    //
    //
    //

    'encryptionAlgorithm': 'aes-128-cbc',
    'iteration': 100,
    'hashBytes': 16,
    'hashAlgorithm': 'sha1',
  };

  Model.observe('persist', function event(ctx, next) {
    const iv = Buffer.from(options.hexIv || defaultOpt.hexIv, 'hex');
    crypto.pbkdf2(options.password || defaultOpt.password,
      options.salt || defaultOpt.salt,
      options.iteration || defaultOpt.iteration,
      options.hashBytes || defaultOpt.hashBytes,
      options.hashAlgorithm || defaultOpt.hashAlgorithm,
      function(err, derivedKey) {
        if (err) {
          console.log(err);
          next(err);
        } else {
          const fields = options.fields || defaultOpt.fields;

          try {
            for (const i in fields) {
              const cipher = crypto.createCipheriv(options.encryptionAlgorithm || defaultOpt.encryptionAlgorithm, derivedKey, iv);
              let crypted = cipher.update(ctx.data[fields[i]], 'utf8', 'hex');
              crypted += cipher.final('hex');
              ctx.data[fields[i]] = crypted;
            }
          } catch (ex) {
            ex.message += '\nThis usually happens when the field contains a plain text! please make sure to remove/re-save that';
            console.log(ex.message);
          } finally {
            next();
          }
        }
      });
  });

  Model.observe('loaded', function event(ctx, next) {
    const iv = Buffer.from(options.hexIv || defaultOpt.hexIv, 'hex');
    crypto.pbkdf2(options.password || defaultOpt.password,
      options.salt || defaultOpt.salt,
      options.iteration || defaultOpt.iteration,
      options.hashBytes || defaultOpt.hashBytes,
      options.hashAlgorithm || defaultOpt.hashAlgorithm,
      function(err, derivedKey) {
        if (err) {
          console.log(err);
          next(err);
        } else {
          const fields = options.fields || defaultOpt.fields;
          try {
            for (const i in fields) {
              const cipher = crypto.createDecipheriv(options.encryptionAlgorithm || defaultOpt.encryptionAlgorithm, derivedKey, iv);
              let decrypted = cipher.update(ctx.data[fields[i]], 'hex', 'utf8');
              decrypted += cipher.final('utf8');
              ctx.data[fields[i]] = decrypted;
            }
          } catch (ex) {
            ex.message += '\nThis usually happens when the field contains a plain text! please make sure to remove/re-save that';
            console.log(ex.message);
          } finally {
            next();
          }
        }
      });
  });
};
