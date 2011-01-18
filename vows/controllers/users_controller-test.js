var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index')


vows_http.initialize(3001, 'localhost')

vows.
  describe('Users Controller').
  addBatch({
    'create with invalid user': {
      topic: function() {
        var callback = this.callback;
        vows_http.post('/reset', function() {
          vows_http.post('/ws/users', callback, {})
        });
      },
      'should be an invalid request': function (error, response) {
        assert.equal(response.statusCode, 400);
      }        
    }
  })
  .addBatch({
    'create with valid user': {
      topic: function() {
        var callback = this.callback;
        vows_http.post('/reset', function() {
          vows_http.post('/ws/users', callback, { username: "alex", password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"});
        });
      },
      'should return 201': function(err, res) {
        assert.equal(res.statusCode, 201);
      },
      'should return the user': function(err, res) {
        assert.deepEqual(res.body, {id: 'user-alex', username: "alex", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"});
      }
    }
  })
  .export(module);
  
  