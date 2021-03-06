// origin: M

var vows = require('vows'),
  assert = require('assert'),
  assertStatusCode = require('../vows_helpers.js').assertStatusCode,
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  reset_database = require('../vows_helpers.js').reset_database

vows_http.initialize(3001, 'localhost')

vows.
  describe('MembersController').
  addBatch({
    'show': {
      'with logged in user': {
        topic: function() {
          var callback = this.callback
          reset_database(function() {
            vows_http.post('/ws/members', function(error, response){
              vows_http.get('/ws/members/alex', callback)
            },
            { username: "alex", password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"})
          })
        },
        'should return the member': function(error, response) {
          assert.deepEqual(response.body, { username: "alex", email: "test@best.de", fullname: "Alex Lang", town: "Berlin", country: "Germany"});
        }
      }
    }
  })
  .addBatch({
    'create with invalid member': {
      topic: function() {
        var callback = this.callback;
        reset_database(function(){
          vows_http.post('/ws/members', callback, {})
        });
      },
      'should be an invalid request': assertStatusCode(400)
    }
  })
  .addBatch({
    'create with valid member': {
      topic: function() {
        var callback = this.callback;
        reset_database(function(){
          vows_http.post('/ws/members', callback, { username: "alex", password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"});
        });
      },
      'should return 200': assertStatusCode(200),
      'should return the user': function(err, res) {
        assert.deepEqual(res.body, {id: 'user-alex', username: "alex", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"});
      }
    }
  })
  .addBatch({
    'create with username already taken': {
      topic: function() {
        var callback = this.callback,
          valid_user_params = { username: "alex", password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"};
        reset_database(function() {
          vows_http.post('/ws/members', function(err, res) {
            vows_http.post('/ws/members', callback, valid_user_params);
          }, valid_user_params);
        });
      },
      'should return 400': assertStatusCode(400)
    }
  })
  
  .export(module);
