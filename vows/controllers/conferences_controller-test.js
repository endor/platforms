// origin: M

var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  _ = require('../../public/vendor/underscore/underscore')._,
  assertStatusCode = require('../vows_helpers.js').assertStatusCode,
  logIn = require('../vows_helpers.js').logIn;

vows_http.initialize(3001, 'localhost');
var validConference = {name: 'tech', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}]};

vows.
  describe('ConferencesController').
  addBatch({
    'create with valid conference': {
      topic: function () {
        var callback = this.callback;
        
        vows_http.get('/reset', function() {
          vows_http.post('/ws/conferences', callback, validConference);
        });
      },
  
      'should return 200': assertStatusCode(200),
  
      'should return the new conference': function(error, response) {
        assert.isTrue(response.body.version.length > 0);
        delete response.body.version;
        assert.deepEqual(response.body, {name: 'tech', id: 'conference-tech', startdate: '20110302', enddate: '20110304', categories: [{name: 'tech'}]});
      }
    }
  }).
  addBatch({
    'create with invalid conference': {
      topic: function () {
        var callback = this.callback;
        
        vows_http.get('/reset', function() {
          vows_http.post('/ws/conferences', callback, {name: ''});
        });
      },
  
      'should return 400': assertStatusCode(400),
    },
    'create without permission': {
      // XXX
    }
  }).
  addBatch({
    'adding attendees with an invalid conference id': {
      topic: function() {
        vows_http.post('/ws/conferences/abc/attendees', this.callback, {username: 'admin'});
      },
      
      'should return a 404': assertStatusCode(404)
    },
    
    'adding attendees where my username does not equal the logged in username': {
      topic: function() {
        var callback = this.callback;
        vows_http.get('/reset', function() {
          vows_http.post('/ws/members', function() {
            vows_http.post('/ws/conferences', function(err, res) {
              vows_http.post('/ws/conferences/conference-tech/attendees', callback, {username: 'admin'});
            }, validConference);
          }, { username: "frank", password: "test", fullname: "Frank", town: "Berlin", country: "Germany", email: "test@best.de"})
        });
      },
      
      'should return a 403': assertStatusCode(403)
    },
    
    'adding attendees were conference and given username are correct': {
      topic: function() {
        var callback = this.callback;
        
        vows_http.get('/reset', function() {
          logIn(vows_http, function() {
            vows_http.post('/ws/conferences', function(err, res) {
              vows_http.post('/ws/conferences/conference-tech/attendees', callback, {username: 'frank'});
            }, validConference);            
          });
        });        
      },
      
      'should return a 204': assertStatusCode(204)
    }
  }).
  addBatch({
    'index with no conferences': {
      topic: function() {
        var callback = this.callback;
        vows_http.get('/reset', function() {
          vows_http.get('/ws/conferencesbycategory', callback);
        });
      },
      'should return 204': assertStatusCode(204)
    }
  }).
  addBatch({
    'index': {
      topic: function() {
        var callback = this.callback;
        
        vows_http.get('/reset', function() {
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
      
      'should return 200': assertStatusCode(200),
      
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
        
        'should return 404': assertStatusCode(404)
      }
    }
  }).
  export(module);