var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index');  

vows_http.initialize(3001, 'localhost')

vows.
  describe('Session Controller').
  addBatch({
    'create': {
      'with valid user': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/reset', function(err, res) {
            vows_http.post('/ws/members', function(e, res) {
              vows_http.put('/session', callback, {session: {username: 'joe', password: 'test'}})
            }, {user: {email: 'joe@doe.com', username: 'joe', town: 'Berlin',
                fullname: 'joe doe', country: 'Germnay', password: 'test'}})
          });
        },
        'should return 200': function(err, res) {
          assert.equal(res.statusCode, 200);
        },
        'should return the session id in a cookie': function (error, response) {
          assert.match(response.headers['set-cookie'], /_node=[^;]+;/);
        }
      }
    }
  }).
  export(module);