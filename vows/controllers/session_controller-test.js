var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index');  

vows_http.initialize(3001, '127.0.0.1')

vows.
  describe('Session Controller').
  addBatch({
    'create': {
      'with valid user': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/users', function(e, res) {
            vows_http.put('/session', callback, {session: {username: 'joe', password: 'test'}})
          }, {user: {email: 'joe@doe.com', username: 'joe', town: 'Berlin',
              fullname: 'joe doe', country: 'Germnay', password: 'test'}})
        },

        'should return the session id in a cookie': function (error, response) {
          assert.match(response.headers['set-cookie'], /_node=[^;]+;/);
          /**
            TODO:
              stub successful authentication or cleanup database
              check for error codes when logging in with wrong details
          */
        }        
      }
    }
  }).
  export(module);