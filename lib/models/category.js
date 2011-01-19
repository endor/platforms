// origin: M
// category model, handles parsing from params, conversion to db/api compatible formats, validations

var _ = require('../../public/vendor/underscore/underscore')._,
  createValidFunction = require('./model').createValidFunction,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  createId = require('./model').createId;

var cloneCategoryAttributes =  cloneAttributesFunction(['version', 'id', 'name', 'parent', 'parent_id']);
  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('name', 'notEmpty', "can't be blank.");
  }),
  toDoc: function() {
    var doc = cloneCategoryAttributes(this);
    return _(doc).extend({_id: Category.toId(this.name), type: 'Category'});
  },
  toApi: function() {
    var api = cloneCategoryAttributes(this);
    delete(api.errors);
    delete(api.valid);
    return _({parent: null, subcategories: this.subcategories || []}).extend(api);
  },
  toEmbeddedApi: function(request) {
    return {name: this.name, details: 'http://' + request.header('host') + '/ws/categories/' + this.id};
  }
};

Category = module.exports = {
  toId: function(name) {
    return createId('category', name);
  },
  fromDoc: function(doc) {
    return _(doc).extend({id: doc._id}, instance_methods);
  },
  fromParams: function(params) {
    return _(cloneCategoryAttributes(params)).extend(instance_methods);
  }
};
