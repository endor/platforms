var _ = require('../../public/vendor/underscore/underscore')._,
  createValidFunction = require('./model').createValidFunction,
  cloneAttributesFunction = require('./model').cloneAttributesFunction;

var cloneConferenceAttributes =  cloneAttributesFunction(['version', 'id', 'name']);
  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('name', 'notEmpty', "can't be blank.");
    validate('startdate', 'notEmpty', "can't be blank.");
    validate('enddate', 'notEmpty', "can't be blank.");
    validate('categories', 'notEmpty', "has to be at least one.");
  }),
  toDoc: function() {
    var doc = cloneConferenceAttributes(this);
    delete(doc.password);
    return _(doc).extend({_id: Conference.toId(this.name), type: 'conference'});
  },
  toApi: function() {
    var api = cloneConferenceAttributes(this);
    delete(api.errors);
    delete(api.valid);    
    return _(api).extend({});
  }
};

Conference = module.exports = {
  toId: function(name) {
    return 'conference-' + name;
  },
  fromDoc: function(doc) {
    return _(doc).extend(instance_methods);
  },
  fromParams: function(params) {
    return _(params).extend(instance_methods);
  }
};
