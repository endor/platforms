// origin: M

var assert = require('assert'),
    vows_http = require(__dirname + '/../vendor/vows-http/index');

module.exports = {
  reset_database: function(callback){
    vows_http.get('/reset', callback, {'authorization': 'Basic YWRtaW46YWRtaW4='});
  },
  assertStatusCode: function(code) {
    return function(err, response) { assert.equal(response.statusCode, code); }
  },
  logIn: function(vows_http, callback) {
    vows_http.post('/ws/members', function(err) {
      if(err) {
        console.log(err);
      } else {
        vows_http.put('/session', function(err) {
          if(err) {
            console.log(err);
          } else {
            callback();
          }
        }, { username: 'frank', password: 'test' });
      }
      
    }, { username: "frank", password: "test", fullname: "Frank", town: "Berlin", country: "Germany", email: "test@best.de" });
  }
};
