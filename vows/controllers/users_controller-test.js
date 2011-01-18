var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index');  

vows_http.initialize(3001, 'localhost')

vows.
  describe('Users Controller').
  addBatch({
    'create': {
      'with invalid user': {
        topic: function () {
          vows_http.post('/users', this.callback, {user: {}})
        },

        'should be an unprocessable entity': function (error, response) {
          assert.equal(response.statusCode, 422);
        }        
      }
    }
  }).
  export(module);