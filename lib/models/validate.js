var Validator = require('../../vendor/node-validator').check;

module.exports = {
  createValidFunction: function(validations) {
    return function() {
      var v = new Validator(), model = this;

      model.errors = {};
      model.valid = true;

      var validate = function (attribute, validator, message) {
        v.error = function(msg) {
          model.errors[attribute] = model.errors[attribute] || [];
          model.errors[attribute].push(msg);
          model.valid = false;
        };

        v.check(model[attribute], message)[validator]();

        return model.valid;
      };
      
      validations(validate);
      
      return model.valid;
    }
  }
};
