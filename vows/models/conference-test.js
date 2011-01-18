var vows = require('vows'),
  assert = require('assert'),
  Conference = require('../../lib/models/conference');
    
var isInvalid = function(topic) {
  assert.isFalse(topic.valid());
};

vows.
  describe('Conference').
  addBatch({
    'the Conference class': {
      'called with toId': {
        topic: Conference.toId('tech'),
        
        'should prefix the name': function(topic) {
          assert.equal(topic, 'conference-tech');
        }
      }
    },
    'a Conference': {
      'with a missing name': {
        topic: Conference.fromParams({name: '', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'tech-category'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the name': function(topic) {
          assert.equal(topic.errors.name[0], "can't be blank.");
        }
      },
      'with a missing start date': {
        topic: Conference.fromParams({name: 'tech', startdate: '', enddate: '04.03.2011', categories: [{id: 'tech-category'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the start date': function(topic) {
          assert.equal(topic.errors.startdate[0], "can't be blank.");
        }        
      },
      'with a missing end date': {
        topic: Conference.fromParams({name: 'tech', startdate: '02.03.2011', enddate: '', categories: [{id: 'tech-category'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the end date': function(topic) {
          assert.equal(topic.errors.enddate[0], "can't be blank.");
        }
      },
      'with a missing category': {
        topic: Conference.fromParams({name: 'tech', startdate: '02.03.2011', enddate: '04.03.2011', categories: []}),
        
        'is invalid': isInvalid,
        
        'has an error on the categories': function(topic) {
          assert.equal(topic.errors.categories[0], "has to be at least one.");
        }
      },
      'with all attributes set correctly': {
        topic: Conference.fromParams({name: 'tech', startdate: '02.03.2011', enddate: '04.03.2011', categories: [{id: 'tech-category'}]}),

        'is valid': function(topic) {
          assert.isTrue(topic.valid());
        },
        
        'called with toApi': {
          topic: function(conference) {
            conference.version = '1';
            conference.id = 'conference-tech';
            return conference.toApi()
          },
          
          'should remove the errors and valid': function(topic) {
            assert.isUndefined(topic.errors);
            assert.isUndefined(topic.valid);
          },
          'should return the name, version and id': function(topic) {
            assert.equal(topic.name, 'tech')
            assert.equal(topic.id, 'conference-tech');
            assert.equal(topic.version, '1');
          }
        }
      }
    }
  }).
  export(module);