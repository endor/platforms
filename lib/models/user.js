var _ = require('../../public/vendor/underscore/underscore')._,
  Validator = require('../../vendor/node-validator').check,
  hash = require('../../vendor/node_hash');

User = module.exports = {
  toId: function(username) {
    return 'user-' + username;
  },
  fromParams: function(params) {
    var model;
    return model = _(params).extend({
      salt: randomString(10),
      encrypted_password: encryptPassword(params.password, this.salt),
      valid: function() {
        this.errors = {};
        this.valid = true;

        var v = new Validator();

        validate('email', 'isEmail', 'is not a valid email address.');
        validate('username', 'notEmpty', "can't be blank.");
        validate('full_name', 'notEmpty', "can't be blank.");
        validate('town', 'notEmpty', "can't be blank.");
        validate('life_motto', 'notEmpty', "can't be blank.");
        validate('password', 'notEmpty', "can't be blank.");

        return this.valid;

        function validate(attribute, validator, message) {
          v.error = function(msg) {
            model.errors[attribute] = model.errors[attribute] || [];
            model.errors[attribute].push(msg);
            model.valid = false;
          };
          v.check(model[attribute], message)[validator]();
        }
      },
      toDoc: function() {
        var doc = _(this).clone();
        delete(doc.password);
        return _(doc).extend({_id: User.toId(this.username)});
      },
      authenticate: function(password) {
        return model.encrypted_password == encryptPassword(password);
      }
    });
  }
};

function encryptPassword(password, salt) {
  return hash.sha256(password + salt);
};

function randomString(bits) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    rand, i, ret = '';
  // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey it gives 53)
  while(bits > 0) {
    rand = Math.floor(Math.random()*0x100000000); // 32-bit integer
    // base 64 means 6 bits per character, so we use the top 30 bits from rand to give 30/6=5 characters.
    for(i=26; i>0 && bits>0; i-=6, bits-=6) {
      ret += chars[0x3F & rand >>> i];
    }
  };
  return ret;
  
}