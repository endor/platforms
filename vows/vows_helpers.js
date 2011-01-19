// origin: M

var assert = require('assert');

module.exports = {
  assertStatusCode: function(code) {
    return function(err, response) { assert.equal(response.statusCode, code); }
  },
  logIn: function(vows_http, callback) {
    vows_http.post('/ws/members', function() {
      vows_http.put('/session', function() {
        callback();
      }, { username: 'frank', password: 'test' });
    }, { username: "frank", password: "test", fullname: "Frank", town: "Berlin", country: "Germany", email: "test@best.de" });
  }
};
