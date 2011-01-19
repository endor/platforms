// origin: M

var vows = require('vows'),
  assert = require('assert'),
  vows_http = require(__dirname + '/../../vendor/vows-http/index'),
  assertStatusCode = require('../vows_helpers.js').assertStatusCode,
  _ = require('../../public/vendor/underscore/underscore')._;
  reset_database = require('../vows_helpers.js').reset_database

vows_http.initialize(3001, 'localhost');


vows.describe('CategoriesController')
  .addBatch({
    'create with valid category': {
      topic: function () {
        var callback = this.callback;
        
        reset_database(function() {
          vows_http.post('/ws/categories', callback, {name: 'tech'}, {'authorization': 'Basic YWRtaW46YWRtaW4='});
        });
      },
      
      'should return 200': assertStatusCode(200),

      'should return the new category': function(error, response) {
        assert.isTrue(response.body.version.length > 0);
        var category_without_version = response.body;
        delete(category_without_version.version);
        
        assert.deepEqual(category_without_version, {name: 'tech', id: 'category-tech',
          parent: null, subcategories: []});        
      }
    }
  })
  .addBatch({
    'create with a parent': {
      topic: function() {
        var callback = this.callback;
        
        reset_database(function() {
          vows_http.post('/ws/categories', function() {
            vows_http.post('/ws/categories', function() {
              vows_http.get('/ws/categories/category-coffee', callback);
            }, {name: 'tea', parent: {name: 'coffee'}}, {'authorization': 'Basic YWRtaW46YWRtaW4='});            
          }, {name: 'coffee'}, {'authorization': 'Basic YWRtaW46YWRtaW4='});
        });
      },
      
      'should allow retrieving the subcategories': function(err, response) {
        assert.deepEqual(response.body.subcategories, [{name: 'tea', details: 'http://localhost:3001/ws/categories/category-tea'}]);
      }
    }
  })
  .addBatch({
    'create with invalid category': {
      topic: function () {
        var callback = this.callback;
        
        reset_database(function() {
          vows_http.post('/ws/categories', callback, {name: ''}, {'authorization': 'Basic YWRtaW46YWRtaW4='});
        });
      },
  
      'should return 400': assertStatusCode(400)
    },
    'without permission': {
      // XXX
    }
  })
  .addBatch({
    'list with a category': {
      topic: function() {
        var callback = this.callback;
    
        reset_database(function() {
          vows_http.post('/ws/categories', function() {
            vows_http.get('/ws/categories', callback);
          }, {name: 'tech'});
        });
      },
      'should return 200': assertStatusCode(200),
      'should list that category': function(err, res) {
        var categories = res.body;
        assert.deepEqual(categories, [{name: 'tech', details: 'http://localhost:3001/ws/categories/category-tech'}]);
      }
    }
  })
  .addBatch({
    'with no category': {
      topic: function() {
        var callback = this.callback;
        reset_database(function() {
          vows_http.get('/ws/categories', callback);
        });
      },
      'should return 204': assertStatusCode(204),
      'should render an empty list': function(err, res) {
        assert.deepEqual(res.body, []);
      }
    }
  })
  .export(module);