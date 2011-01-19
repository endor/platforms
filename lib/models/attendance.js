var _ = require('../../public/vendor/underscore/underscore')._,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  createId = require('./model').createId;

var cloneAttendanceAttributes =  cloneAttributesFunction(['version', 'id', 'attendee', 'member_id']);
  
var instance_methods = {
  toDoc: function(db, callback) {
    var doc = _(cloneAttendanceAttributes(this)).extend({_id: Attendance.toId(this.attendee + this.category_id), type: 'Attendance'});
    if(!this.member_id) {
      db.view('users', 'by_username', {include_docs: true, key: this.attendee}, function(err, result) {
        if(err) {
          callback(err);
        } else {
          doc.member_id = result.rows[0].doc._id;
          callback(null, doc);
        }
      });
    } else {
      callback(null, doc);
    };
  },
  toApi: function() {
    var api = cloneAttendanceAttributes(this);
    delete(api.errors);
    delete(api.valid);
    return _({id: this._id}).extend(api);
  }
};

Attendance = module.exports = {
  toId: function(username_category_id) {
    return createId('attendance', username_category_id);
  },
  fromDoc: function(doc) {
    return _(doc).extend({id: doc._id, version: doc._rev}, instance_methods);
  },
  fromParams: function(username, category_id) {
    return _({attendee: username, category_id: category_id}).extend(instance_methods);
  }
};
