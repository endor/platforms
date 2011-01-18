var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  _ = require('../../public/vendor/underscore/underscore')._;

vows_http.initialize(3001, '127.0.0.1')

vows.
  describe('CategoriesController').
  addBatch({
    'create': {
      'with valid category': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/reset', function() {
            vows_http.post('/ws/categories', callback, {name: 'tech'});
          });
        },

        'should return 200': function (error, response) {
          assert.equal(response.statusCode, 200);
        },
        'should return the new category': function(error, response) {
          assert.isTrue(response.body.version.length > 0);
          delete(response.body.version);          
          assert.deepEqual(response.body, {name: 'tech', id: 'category-tech',
            parent: null, subcategories: []});
        }
      },
      'with invalid category': {
        topic: function () {
          var callback = this.callback;
          
          vows_http.post('/reset', function() {
            vows_http.post('/ws/categories', callback, {name: ''});
          });
        },

        'should return 400': function (error, response) {
          assert.equal(response.statusCode, 400);
        },
      },
      'without permission': {
        // XXX
      }
    }
  }).
  export(module);