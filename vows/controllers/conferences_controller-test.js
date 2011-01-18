var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  _ = require('../../public/vendor/underscore/underscore')._;

vows_http.initialize(3001, 'localhost')

vows.
  describe('ConferencesController').
  addBatch({
    'create with valid conference': {
      topic: function () {
        var callback = this.callback;
        
        vows_http.post('/reset', function() {
          vows_http.post('/ws/conferences', callback, {name: 'tech', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}]});
        });
      },

      'should return 200': function (error, response) {
        assert.equal(response.statusCode, 200);
      },
      'should return the new conference': function(error, response) {
        assert.isTrue(response.body.version.length > 0);
        delete response.body.version;
        assert.deepEqual(response.body, {name: 'tech', id: 'conference-tech', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}]});
      }
    }
  }).
  // addBatch({
  //   
  // }).
  addBatch({
    'create with invalid conference': {
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
    'create without permission': {
      // XXX
    }
  }).
  addBatch({
    'index with no conferences': {
      topic: function() {
        var callback = this.callback;
        vows_http.post('/reset', function() {
          vows_http.get('/ws/conferencesbycategory', callback);
        });
      },
      'should return 204': function(err, response) {
        assert.equal(response.statusCode, 204);
      }
    }
  }).
  addBatch({
    'index': {
      topic: function() {
        var callback = this.callback;
        
        vows_http.post('/reset', function() {
          vows_http.post('/ws/categories', function() {
            vows_http.post('/ws/categories', function() {
              vows_http.post('/ws/conferences', function() {
                vows_http.post('/ws/conferences', function() {
                  vows_http.get('/ws/conferencesbycategory', callback);
                }, {name: 'natureconf', startdate: '20110302', enddate: '20110304', categories: [{name: 'nature'}]});
              }, {name: 'techconf', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}]});
            }, {name: 'tech'});
          }, {name: 'nature'})
        });
      },
      
      'should return 200': function(err, response) {
        assert.equal(response.statusCode, 200);
      },
      
      'should return a list of conferences': function(err, response) {
        assert.deepEqual(response.body, [
          {name: 'natureconf', startdate: '20110302', enddate: '20110304',
            categories: [{details: 'http://localhost:3001/ws/categories/category-nature', name: 'nature'}],
            details: 'http://localhost:3001/ws/conferences/conference-natureconf'},
          {name: 'techconf', startdate: '20110302', enddate: '20110304',
            categories: [{details: 'http://localhost:3001/ws/categories/category-tech', name: 'tech'}],
            details: 'http://localhost:3001/ws/conferences/conference-techconf'},
        ]);
      },
      
      'filtered by category': {
        topic: function() {
          vows_http.get('/ws/conferencesbycategory/category-tech', this.callback);
        },
        
        'should return all conferences in the tech category': function(err, response) {
          assert.length(response.body, 1)
          assert.equal(response.body[0].name, 'techconf');
        }
      },
      'filtered by category that doesn\'t exist': {
        topic: function() {
          vows_http.get('/ws/conferencesbycategory/category-unknown', this.callback);
        },
        
        'should return 404': function(err, response) {
          assert.equal(response.statusCode, 404)
        }
      }
    }
  }).
  export(module);