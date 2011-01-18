var _ = require('../../public/vendor/underscore/underscore')._,
  createValidFunction = require('./model').createValidFunction,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  Category = require('./category'),
  createId = require('./model').createId;

var cloneConferenceAttributes =  cloneAttributesFunction(['version', 'id', 'name', 'startdate', 'enddate',
  'categories', 'description', 'location', 'creator', 'series', 'gps', 'venue',
  'accomodation', 'howtofind']);
var cloneEmbeddedConferenceAttributes =  cloneAttributesFunction(['name', 'startdate', 'enddate']);

  
var instance_methods = {
  valid: createValidFunction(function(validate) {
    validate('name', 'notEmpty', "can't be blank.");
    validate('startdate', 'notEmpty', "can't be blank.");
    validate('enddate', 'notEmpty', "can't be blank.");
    validate('categories', 'notEmpty', "has to be at least one.");
  }),
  attend: function(username) {
    this.attendees.push({username: username});
  },
  toDoc: function(db, callback) {
    var doc = _(cloneConferenceAttributes(this)).extend({_id: Conference.toId(this.name), type: 'Conference', attendees: this.attendees});
    db.view('category', 'by_name', {include_docs: true,
      keys: doc.categories.map(function(doc) {return doc.name})}, function(err, result) {
        if(err) {
          callback(err);
        } else {
          doc.category_ids = result.rows.map(function(row) {return row.doc._id});
          callback(null, doc);
        }
    });
  },
  toApi: function() {
    var api = cloneConferenceAttributes(this);
    delete(api.errors);
    delete(api.valid);
    return _({id: this._id}).extend(api);
  },
  toEmbeddedApi: function(req, db, callback) {
    var api = cloneEmbeddedConferenceAttributes(this);
    api.details = 'http://' + req.header('host') + '/ws/conferences/' + this.id;
    delete(api.errors);
    delete(api.valid);
    db.view('category', 'by_id', {include_docs: true, keys: this.category_ids}, function(err, result) {
      if(err) {
        callback(err);
      } else {
        api.categories = result.rows.map(function(row) {
          return Category.fromDoc(row.doc).toEmbeddedApi(req);
        });
        callback(null, api);
      }
    });
  }
};

Conference = module.exports = {
  toId: function(name) {
    return createId('conference', name);
  },
  fromDoc: function(doc) {
    return _(doc).extend({id: doc._id, version: doc._rev}, instance_methods);
  },
  fromParams: function(params) {
    return _(params).extend(instance_methods, {attendees: []});
  }
};
