var vows = require('vows'),
  assert = require('assert'),
  path = require('path'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index');  

vows_http.initialize(3000, 'localhost')

vows.
  describe('Questions Controller').
  addBatch({
    'index': {
      topic: function () {
        vows_http.get('/questions', this.callback)
      },
      
      'should be successful': function (error, response) {
        assert.equal(response.statusCode, 200);
      },
      
      'should return an array of questions': function (error, response) {
        assert.typeOf(JSON.parse(response.body)[0]['question'], 'string');
      }
    }
  }).
  export(module);