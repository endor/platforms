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
          assert.isTrue(response.body.version.length > 0);
          delete response.body.version;
          assert.deepEqual(response.body, {name: 'tech', id: 'conference-tech', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'tech-category'}]});
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
  addBatch({
    'index': {
      topic: function() {
        var callback = this.callback;
        
        vows_http.post('/reset', function() {
          vows_http.post('/ws/conferences', function() {
            vows_http.post('/ws/conferences', function() {
              vows_http.get('/ws/conferences', callback);
            }, {name: 'nature', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'nature-category'}]});            
          }, {name: 'tech', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'tech-category'}]});
        });
      },
      
      'should return 200': function(err, response) {
        assert.equal(response.statusCode, 200);
      },
      
      'should return a list of conferences': function(err, response) {
        assert.length(response.body, 2);
      },
      
      'filtered by category': {
        topic: function() {
          vows_http.get('/ws/conferences?category=tech-category', this.callback);
        },
        
        'should return all conferences in the tech category': function(err, response) {
          assert.length(response.body, 1)
          assert.equal(response.body[0].name, 'nature');
        }
      }
    }
  }).
  export(module);