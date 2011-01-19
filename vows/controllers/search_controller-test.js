// origin: M

var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  assertStatusCode = require('../vows_helpers.js').assertStatusCode,
  _ = require('../../public/vendor/underscore/underscore')._,
 reset_database = require('../vows_helpers.js').reset_database,
  logIn = require('../vows_helpers.js').logIn;

vows_http.initialize(3001, 'localhost')

vows.
  describe('SearchController')
  .addBatch({
    'find conferences by words in name and description': {
      topic: function () {
        var callback = this.callback;
        
        reset_database(function(err, res) {
          logIn(vows_http, function() {
            vows_http.post('/ws/categories', function(err, res) {
              vows_http.post('/ws/conferences', function(err, res) {
                vows_http.get('/ws/search/27c3%20chaos', callback);
                }, {name: '27c3', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}],
                    description: 'a chaos event'}
              );
            }, {name: 'tech'});
          });
        });
      },
      'should return 200': assertStatusCode(200),
      'should return the conference': function(err, res) {
        assert.deepEqual(res.body, [{name: '27c3', startdate: '20110302', enddate: '20110304',
        categories: [{name: 'tech', details: 'http://localhost:3001/ws/categories/category-tech'}],
        details: 'http://localhost:3001/ws/conferences/conference-27c3'}]);
      }
    }
  })
  .addBatch({
    'don\'t find conference that are already over': {
    topic: function() {
      var callback = this.callback;
      
      reset_database(function(err, res) {
        logIn(vows_http, function() {
          vows_http.post('/ws/conferences', function(err, res) {
            vows_http.get('/ws/search/27c3', callback);
          }, {name: '27c3', startdate: '20100302', enddate: '20100304', categories: [{name: 'tech'}],
              description: 'a ccc event'});
        });
      });
    },
    'should return 204': assertStatusCode(204)
    }
  })
  .addBatch({
    'find no conference': {
    topic: function() {
      var callback = this.callback;
      
      reset_database(function(err, res) {
        vows_http.post('/ws/conferences', function(err, res) {
          vows_http.get('/ws/search/28c3', callback);
        }, {name: '27c3', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}],
            description: 'a ccc event'});
      });
    },
    'should return 204': assertStatusCode(204)
    }
  })
  .export(module);