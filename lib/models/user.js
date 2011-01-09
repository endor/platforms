var _ = require('../../public/vendor/underscore/underscore')._,
  Validator = require('../../vendor/node-validator').check;

module.exports = {
  toId: function(username) {
    return 'user-' + username;
  },
  fromParams: function(params) {
    var model = _(params).extend({});
    
    model.valid = function() {
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
        }
        v.check(model[attribute], message)[validator]();
      }
    }
    
    model.toDoc = function() {
      return _(this).extend({_id: User.toId(this.username)});
    };

    return model;
  }
};
