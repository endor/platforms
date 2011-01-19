// origin: M

var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  assertStatusCode = require('../vows_helpers.js').assertStatusCode,
  _ = require('../../public/vendor/underscore/underscore')._;
  var db = require('../../server.js').db;

vows_http.initialize(3001, 'localhost')

vows.
  describe('ResetController').
  addBatch({
    'POST /reset': {
      topic: function () {
        var callback = this.callback;
        
        db.saveDoc({foo: 'bar'}, function(err) {
          vows_http.post('/reset', callback);
        });
      },
      'should return 204': assertStatusCode(204),
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
  addBatch({
    'POST /factorydefaults': {
      topic: function() {
        vows_http.post('/factorydefaults', this.callback);
      },
      'categories': {
        topic: function() {
          vows_http.get('/ws/categories', this.callback);
        },
        'should import categories': function(err, res) {
          assert.isTrue(res.body.length > 0);
        },
      },
      'conferences': {
        topic: function() {
          vows_http.get('/ws/conferencesbycategory', this.callback);
        },
        'should import conferences': function(err, res) {
          assert.isTrue(res.body.length > 0);
        },
      },
      'members': {
        topic: function() {
          vows_http.get('/ws/members/sjobs', this.callback);
        },
        'should return a 200': assertStatusCode(200),
        'should import users': function(err, res) {
          assert.equal(res.body.username, 'sjobs');
        },
      },
      'should load series': function() {
        // XXX
      }
    }
  }).
  export(module);