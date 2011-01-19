// origin: M

var vows = require('vows'),
  assert = require('assert'),
  Category = require('../../lib/models/category');
    
var isInvalid = function(topic) {
  assert.isFalse(topic.valid());
};

vows.
  describe('Category').
  addBatch({
    'the Category class': {
      'called with toId': {
        'should prefix the name': function() {
          assert.equal(Category.toId('tech'), 'category-tech');
        },
        'should escape non-word characters': function(topic) {
          assert.equal(Category.toId('tech house  x'), 'category-tech-house-x');
        }
      },
      'called with fromDoc': {
        topic: Category.fromDoc({_id: '123'}),
        
        'should add the id': function(category) {
          assert.equal(category.id, '123');
        },
        'should add the methods': function(category) {
          assert.isTrue(typeof category.toDoc == 'function');
        }
      },
    },
    'a Category': {
      'with a missing name': {
        topic: Category.fromParams({name: ''}),
        
        'is invalid': isInvalid,
        
        'has an error on the name': function(topic) {
          assert.equal(topic.errors.name[0], "can't be blank.");
        }
      },
      'with all attributes set correctly': {
        topic: Category.fromParams({name: 'tech'}),

        'is valid': function(topic) {
          assert.isTrue(topic.valid());
        }
      },
      'called with toApi': {
        topic: function(category) {
          var category = Category.fromParams({name: 'tech'});
          category.version = '1';
          category.id = 'category-tech';
          return category.toApi()
        },
        
        'should remove the errors and valid': function(topic) {
          assert.isUndefined(topic.errors);
          assert.isUndefined(topic.valid);
        },
        'should return the name, version and id': function(topic) {
          assert.equal(topic.name, 'tech')
          assert.equal(topic.id, 'category-tech');
          assert.equal(topic.version, '1');
        },
        'should return the parent': function(topic) {
          assert.isTrue(topic.parent === null);
        },
        'should return the subcategories': function(topic) {
          assert.deepEqual(topic.subcategories, []);
        }
      },
      'called with toEmbeddedApi': {
        topic: function(category) {
          var category = Category.fromParams({name: 'tech'});
          category.id = 'category-tech';
          var request = {header: function(name) {
            if(name == 'host') {
              return 'localhost:3001'
            };
          }}
          return category.toEmbeddedApi(request)
        },
        'should only include the name and the details link': function(category) {
          assert.deepEqual(category, {name: 'tech', details: 'http://localhost:3001/ws/categories/category-tech'});
        }
      },
      'called with toDoc': {
        topic: function(category) {
          var category = Category.fromParams({name: 'tech'});
          return category.toDoc();
        },
        'should add the type': function(category) {
          assert.equal(category.type, 'Category');
        }
      }
    }
  }).
  export(module);