var _ = require('../../public/vendor/underscore/underscore')._,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  createId = require('./model').createId;

var cloneAttendanceAttributes =  cloneAttributesFunction(['version', 'id', 'target_username', 'target_user_id', 'source_username', 'source_user_id', 'accepted', 'fullname', 'email']);

var instance_methods = {
  toDoc: function(db, callback) {
    return _(cloneAttendanceAttributes(this)).extend({_id: ContactRequest.toId(this.target_username + this.source_username), _rev: this.version, type: 'ContactRequest'});
  },
  toApi: function() {
    var api = cloneAttendanceAttributes(this);
    delete(api.errors);
    delete(api.valid);
    return _({id: this._id}).extend(api);
  }
};

ContactRequest = module.exports = {
  toId: function(id) {
    return createId('contact_request', id);
  },
  fromDoc: function(doc) {
    return _(doc).extend({id: doc._id, version: doc._rev}, instance_methods);
  },
  fromParams: function(params) {
    return _(params).extend(instance_methods);
  }
};
