var _ = require('../../public/vendor/underscore/underscore')._,
  hash = require('../../vendor/node_hash'),
  createValidFunction = require('./model').createValidFunction,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  createId = require('./model').createId;
  
var cloneUserAttributes =  cloneAttributesFunction(['username', 'email', 'fullname', 'town', 'country', 'encrypted_password', 'salt']);
  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('email', 'isEmail', 'is not a valid email address.');
    validate('username', 'notEmpty', "can't be blank.");
    validate('fullname', 'notEmpty', "can't be blank.");
    validate('town', 'notEmpty', "can't be blank.");
    validate('country', 'notEmpty', "can't be blank.");
    validate('password', 'notEmpty', "can't be blank.");
  }),
  toDoc: function() {
    var doc = cloneUserAttributes(this);
    delete(doc.password);
    return _(doc).extend({_id: User.toId(this.username), type: 'User'});
  },
  authenticate: function(password) {
    return this.encrypted_password == encryptPassword(password);
  }
};

User = module.exports = {
  toId: function(username) {
    return createId('user', username);
  },
  fromDoc: function(doc) {
    return _(doc).extend(instance_methods);
  },
  fromParams: function(params) {
    return _(params).extend({
      salt: randomString(256),
      encrypted_password: encryptPassword(params.password, this.salt)
    }, instance_methods);
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