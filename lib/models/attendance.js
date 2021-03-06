// origin: M
// user model, handles parsing from params, conversion to db/api compatible formats, validations

var _ = require('../../public/vendor/underscore/underscore')._,
  cloneAttributesFunction = require('./model').cloneAttributesFunction,
  createId = require('./model').createId;

var cloneAttendanceAttributes =  cloneAttributesFunction(['version', 'id', 'attendee', 'member_id', 'conference_id']);
  
var instance_methods = {
  toDoc: function(db, callback) {
    var doc = _(cloneAttendanceAttributes(this)).extend({_id: Attendance.toId(this.attendee + this.conference_id), type: 'Attendance'});
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
  toId: function(username_conference_id) {
    return createId('attendance', username_conference_id);
  },
  fromDoc: function(doc) {
    return _(doc).extend({id: doc._id, version: doc._rev}, instance_methods);
  },
  fromParams: function(username, conference_id) {
    return _({attendee: username, conference_id: conference_id}).extend(instance_methods);
  }
};
