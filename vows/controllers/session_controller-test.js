// origin: RM

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
          vows_http.post('/reset', function(e, res){
            vows_http.post('/ws/members', function(e, res) {
              vows_http.put('/session', callback, {username: 'joe', password: 'test'});
            }, {email: 'joe@doe.com', username: 'joe', town: 'Berlin',
                fullname: 'joe doe', country: 'Germany', password: 'test'});
          });
        },
        'should return the session id in a cookie': function (error, response) {
          assert.match(response.headers['set-cookie'], /_node=[^;]+;/);
          /**
            TODO:
              stub successful authentication or cleanup database
              check for error codes when logging in with wrong details
          */
        },
        'should return the user': function (error, response) {
          assert.deepEqual(response.body, {email: 'joe@doe.com', username: 'joe', town: 'Berlin',
            fullname: 'joe doe', country: 'Germany'
          });
        },
        'should return 200': function(err, res) {
          assert.equal(res.statusCode, 200);
        }
      }
    }
  }).
  export(module);