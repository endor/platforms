var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index')

vows_http.initialize(3001, 'localhost')

vows.
  describe('Users Controller').
  addBatch({
    'show': {
      'with logged in user': {
        topic: function() {
          var callback = this.callback
          vows_http.post('/reset', function() {
            vows_http.post('/ws/users', function(error, response){
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
  }).export(module);
