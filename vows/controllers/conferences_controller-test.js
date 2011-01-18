var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  _ = require('../../public/vendor/underscore/underscore')._;

vows_http.initialize(3001, '127.0.0.1')

vows.
  describe('ConferencesController').
  addBatch({
    'create': {
      'with valid conference': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/reset', function() {
            vows_http.post('/ws/conferences', callback, {name: 'tech', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'tech-category'}]});
          });
        },

        'should return 200': function (error, response) {
          assert.equal(response.statusCode, 200);
        },
        'should return the new conference': function(error, response) {
          var conference_without_version = JSON.parse(response.body);
          delete(conference_without_version.version);
          
          assert.deepEqual(conference_without_version, {name: 'tech', id: 'conference-tech'});
          assert.isTrue(JSON.parse(response.body).version.length > 0);
        }
      },
      'with invalid conference': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/reset', function() {
            vows_http.post('/ws/conferences', callback, {name: ''});
          });
        },

        'should return 400': function (error, response) {
          assert.equal(response.statusCode, 400);
        },
      },
      'without permission': {
        // XXX
      }
    }
  }).
  export(module);