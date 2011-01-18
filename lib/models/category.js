var _ = require('../../public/vendor/underscore/underscore')._,
  createValidFunction = require('./model').createValidFunction,
  cloneAttributesFunction = require('./model').cloneAttributesFunction;

var cloneCategoryAttributes =  cloneAttributesFunction(['version', 'id', 'name']);
  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('name', 'notEmpty', "can't be blank.");
  }),
  toDoc: function() {
    var doc = cloneCategoryAttributes(this);
    delete(doc.password);
    return _(doc).extend({_id: Category.toId(this.name)});
  },
  toApi: function() {
    var api = cloneCategoryAttributes(this);
    delete(api.errors);
    delete(api.valid);
    return _(api).extend({parent: null, subcategories: []});
  }
};

Category = module.exports = {
  toId: function(name) {
    return 'category-' + name;
  },
  fromDoc: function(doc) {
    return _(doc).extend(instance_methods);
  },
  fromParams: function(params) {
    return _(params).extend(instance_methods);
  }
};
