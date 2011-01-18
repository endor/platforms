// origin: M

var vows = require('vows'),
  assert = require('assert'),
  computeStatusCode = require('../../lib/helpers/controller_helpers').computeStatusCode;
    
vows.
  describe('Controller Helpers').
  addBatch({
    'computeStatusCode': {
      'with a request containing the jquery headers': {
        topic: computeStatusCode({isXMLHttpRequest: true}, 204),
        
        'should return a 200 status code': function(topic) {
          assert.equal(topic, 200);
        }
      },
      
      'with a request not containing the jquery headers': {
        topic: computeStatusCode({isXMLHttpRequest: false}, 204),
        
        'should return a 204 status code': function(topic) {
          assert.equal(topic, 204);
        }
      }
    }
  }).
  export(module);