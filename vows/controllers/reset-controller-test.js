var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  _ = require('../../public/vendor/underscore/underscore')._;
  var db = require('../../server.js').db;

vows_http.initialize(3001, '127.0.0.1')

vows.
  describe('CategoriesController').
  addBatch({
    'POST': {
      topic: function () {
        var callback = this.callback;
        
        db.saveDoc({foo: 'bar'}, function(err) {
          vows_http.post('/reset', callback);
        });
      },
      'should return 204': function (error, response) {
        assert.equal(response.statusCode, 204);
      },
      'when loading all documents': {
        topic: function() {
          db.allDocs(this.callback);
        },
        'should empty the database': function(err, docs) {
          assert.isTrue(docs.rows.filter(function(row) {return row.id.indexOf('_design') == -1}).length == 0);
        },
        'should rebuild the views': function(err, docs) {
          assert.isTrue(docs.rows.filter(function(row) {return row.id.indexOf('_design') != -1}).length > 0);
        }
      }
    }
  }).
  export(module);