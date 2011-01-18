var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index')

vows_http.initialize(3001, 'localhost')

vows.
  describe('MembersController').
  addBatch({
    'show': {
      'with logged in user': {
        topic: function() {
          var callback = this.callback
          vows_http.post('/reset', function() {
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
    'create with invalid members': {
      topic: function() {
        var callback = this.callback;
        vows_http.post('/reset', function() {
          vows_http.post('/ws/members', callback, {})
        });
      },
      'should be an invalid request': function (error, response) {
        assert.equal(response.statusCode, 400);
      }        
    }
  })
  .addBatch({
    'create with valid members': {
      topic: function() {
        var callback = this.callback;
        vows_http.post('/reset', function() {
          vows_http.post('/ws/members', callback, { username: "alex", password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany", email: "test@best.de"});
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
