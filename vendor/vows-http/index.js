/**
 * Vows-HTTP - a tiny http client lib for use with vows
 * Frank Prößdorf <fp@notjusthosting.com>
 * MIT Licensed
 */

/**
 * TODO:
 *   start server if it's not running yet and close it afterwards
 *   support session handling
 *   support sending data
 *   support errors
 */

var http = require('http');

var vows_http = {
  client: null,
  request: null,
  initialize: function(port, url) {
    this.client = http.createClient(port, url);
  },
  send_request: function(type, url, callback) {
    this.request = this.client.request(type, url),
      body = '';
    this.request.end();
    this.request.on('response', function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function() {
        response.body = body
        callback(null, response);
      });
    });
  },
  get: function (url, callback) {
    send_request('GET', url, callback);
  },
  post: function(url, callback) {
    send_request('POST', url, callback);
  },
  put: function(url, callback) {
    send_request('PUT', url, callback);
  },
  del: function(url, callback) {
    send_request('DELETE', url, callback);
  }
}

module.exports = vows_http;