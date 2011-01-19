// origin: RM
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
  send_request: function(type, url, callback, data, custom_headers) {
    var headers = {host: this.client.host + ':' + this.client.port, 'x-requested-with': 'VowsHTTP'},
      context = this;
    
    if(context.cookie) { headers.cookie = context.cookie; }
    
    if(data) {
      data = JSON.stringify(data);
      headers['Content-Length'] = data.length;
      headers['Content-Type'] = 'application/json';
    };
    
    if (custom_headers){
      for (key in custom_headers){
        headers[key] = custom_headers[key];
      }
    }

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
  get: function (url, callback, headers) {
    this.send_request('GET', url, callback, {}, headers);
  },
  post: function(url, callback, data, headers) {
    this.send_request('POST', url, callback, data, headers);
  },
  put: function(url, callback, data, headers) {
    this.send_request('PUT', url, callback, data, headers);
  },
  del: function(url, callback, headers) {
    this.send_request('DELETE', url, callback, {}, headers);
  }
}

module.exports = vows_http;