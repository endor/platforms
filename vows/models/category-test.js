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
        topic: Category.toId('tech'),
        
        'should prefix the name': function(topic) {
          assert.equal(topic, 'category-tech');
        }
      }
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
        },
        
        'called with toApi': {
          topic: function(category) {
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
          },
        }
      }
    }
  }).
  export(module);