var _ = require('../../public/vendor/underscore/underscore')._,
  Validator = require('node-validator').check;

module.exports = {
  fromParams: function(params) {
    var model = _(params).extend({});
    
    // model.validate = function() {
    //   var check = new Validator();
    //   check.error = function(msg) {
    //     model.errors[].push(msg);
    //   }
    //   v.check('abc').isInt(); //'Fail'
    //   
    //   check(this.email).isEmail();
    //   check(this.full_name).notEmpty();
    //   check(this.town).notEmpty();
    //   check(this.life_motto).notEmpty();
    //   check(this.username).notEmpty();
    //   check(this.password).notEmpty();
    // }
    
    model.toDoc = function() {
      return _(this).extend({_id: 'user-' + this.username});
    };

    return model;
  }
};
