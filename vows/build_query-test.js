var vows = require('vows'),
  assert = require('assert'),
  buildQuery = require('../lib/build_query');
    
vows.
  describe('buildQuery').
  addBatch({
    'should filter out past conferences': {
      'should set the member id': function(err, attendance) {
        var orig_date = Date;
        Date = function() {
          this.getFullYear = function() {return 2011};
          this.getMonth = function() {return 0};
          this.getDate = function() {return 1};
        };
        try {
         assert.include(buildQuery(''), ' AND enddate<date>:[2011-01-01 TO 2099-12-31]');
        } catch(e) {
          throw(e);
        } finally {
          Date = orig_date;
        };
      }
    }
  }).
  export(module);