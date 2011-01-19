/**
 * Vows-HTTP - a tiny http client lib for use with vows
 * Frank Prößdorf <fp@notjusthosting.com>
 * MIT Licensed
 */

/**
 * TODO:
 *   start server if it's not running yet and close it afterwards
 *   support session handling
 *   support errors
 */

var http = require('http');

var vows_http = {
  client: null,
  cookie: null,
  initialize: function(port, host) {
    this.client = http.createClient(port, host);
  },
  send_request: function(type, url, callback, data) {
    var headers = {host: this.client.host + ':' + this.client.port, 'x-requested-with': 'VowsHTTP'},
      context = this;
    
    if(context.cookie) { headers.cookie = context.cookie; }
    
    if(data) {
      data = JSON.stringify(data);
      headers['Content-Length'] = data.length;
      headers['Content-Type'] = 'application/json';
    };

    var request = this.client.request(type, url, headers);
    
    if(data) { request.write(data); }

    request.end();
    request.on('response', function (response) {
      response.body = '';
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        response.body += chunk;
      });
      response.on('end', function() {
        if(response.headers['set-cookie']) { context.cookie = response.headers['set-cookie']; }
        if(response.body[0] === "{" || response.body[0] === '[') {
          response.body = JSON.parse(response.body);          
        }
        callback(null, response);
      });      
    });
  },
  get: function (url, callback) {
    this.send_request('GET', url, callback);
  },
  post: function(url, callback, data) {
    this.send_request('POST', url, callback, data);
  },
  put: function(url, callback, data) {
    this.send_request('PUT', url, callback, data);
  },
  del: function(url, callback) {
    this.send_request('DELETE', url, callback);
  }
}

module.exports = vows_http;