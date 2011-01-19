var vows = require('vows'),
  assert = require('assert'),
  Attendance = require('../../lib/models/attendance');
    
vows.
  describe('Attendance').
  addBatch({
    'called with toDoc': {
      topic: function() {
        var attendance = Attendance.fromParams('frank', 'category-Nature');
        var db = {
          view: function(design, view, options, callback) {
            if(design == 'users' && view == 'by_username' && options.key == 'frank') {
              callback(null, {rows: [{doc: {_id: 'member-frank'}}]})
            }
          }
        };
        attendance.toDoc(db, this.callback);
      },

      'should set the member id': function(err, attendance) {
        assert.deepEqual(attendance.member_id, 'member-frank');
      }
    }
  }).
  export(module);