var _ = require('../../public/vendor/underscore/underscore')._,
  createValidFunction = require('./validate').createValidFunction;
  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('name', 'notEmpty', "can't be blank.");
  }),
  toDoc: function() {
    var doc = cloneAttributes(this);
    delete(doc.password);
    return _(doc).extend({_id: Category.toId(this.name)});
  },
  toApi: function() {
    var api = cloneAttributes(this);
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

function cloneAttributes(object) {
  var category_attributes = ['version', 'id', 'name'];
  var category = {};
  for(var i in object) {
    if(category_attributes.indexOf(i) != -1) {
      category[i] = object[i];
    }
  }
  return category;
}