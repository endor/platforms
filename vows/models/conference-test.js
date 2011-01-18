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
        topic: Conference.toId('techconf'),
        
        'should prefix the name': function(topic) {
          assert.equal(topic, 'conference-techconf');
        }
      },
      'called with fromDoc': {
        topic: Conference.fromDoc({_id: 'conference-techconf', _rev: '123'}),
        'should add the id and version': function(conference) {
          assert.equal(conference.id, 'conference-techconf');
          assert.equal(conference.version, '123');
        }
      }
    },
    'a Conference': {
      'with a missing name': {
        topic: Conference.fromParams({name: '', startdate: '20110302', enddate: '20110304', categories: [{id: 'category-tech'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the name': function(topic) {
          assert.equal(topic.errors.name[0], "can't be blank.");
        }
      },
      'with a missing start date': {
        topic: Conference.fromParams({name: 'techconf', startdate: '', enddate: '20110304', categories: [{id: 'category-tech'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the start date': function(topic) {
          assert.equal(topic.errors.startdate[0], "can't be blank.");
        }        
      },
      'with a missing end date': {
        topic: Conference.fromParams({name: 'techconf', startdate: '20110302', enddate: '', categories: [{id: 'category-tech'}]}),
        
        'is invalid': isInvalid,
        
        'has an error on the end date': function(topic) {
          assert.equal(topic.errors.enddate[0], "can't be blank.");
        }
      },
      'with a missing category': {
        topic: Conference.fromParams({name: 'techconf', startdate: '20110302', enddate: '20110304', categories: []}),
        
        'is invalid': isInvalid,
        
        'has an error on the categories': function(topic) {
          assert.equal(topic.errors.categories[0], "has to be at least one.");
        }
      },
      'with all attributes set correctly': {
        topic: Conference.fromParams({name: 'techconf', startdate: '20110302', enddate: '20110304', categories: [{id: 'category-tech'}]}),
        
        'is valid': function(topic) {
          assert.isTrue(topic.valid());
        },
        
        'called with toApi': {
          topic: function(conference) {
            conference.version = '1';
            conference.id = 'conference-techconf';
            conference.description = 'my conf';
            conference.location = 'berlin';
            conference.gps = '52N,10E';
            conference.venue = 'fernsehturm';
            conference.accomodation = 'hotel';
            conference.howtofind = 'easy';
            
            conference.toDoc = function() {};
            
            return conference.toApi()
          },
          'should remove the errors and valid': function(topic) {
            assert.isUndefined(topic.errors);
            assert.isUndefined(topic.valid);
          },
          'should remove the instance methods': function(conference) {
            assert.isUndefined(conference.toApi);
          },
          'should return all the attributes': function(conference) {
            assert.equal(conference.name, 'techconf')
            assert.equal(conference.id, 'conference-techconf');
            assert.equal(conference.version, '1');
            assert.equal(conference.startdate, '20110302');
            assert.equal(conference.enddate, '20110304');
            assert.equal(conference.description, 'my conf');
            assert.equal(conference.location, 'berlin');
            assert.equal(conference.gps, '52N,10E');
            assert.equal(conference.venue, 'fernsehturm');
            assert.equal(conference.accomodation, 'hotel');
            assert.equal(conference.howtofind, 'easy');
          }
        },
        'called with toEmbeddedApi': {
          topic: function(conference) {
            conference.version = '1';
            conference.id = 'conference-techconf';
            conference.category_ids = ['category-tech'];
            conference.toDoc = function() {};
            
            var request = {header: function(name) {
              if(name == 'host') {
                return 'localhost:3000';
              }
            }};
            var db = {
              view: function(design, view, options, callback) {
                if(design == 'category' && view == 'by_id' && options.keys[0] == 'category-tech') {
                  callback(null, {
                    rows: [{doc: {_id: 'category-tech', name: 'tech'}}]
                  });
                }
              }
            };
            conference.toEmbeddedApi(request, db, this.callback);
          },
          'should remove the errors and valid': function(err, conference) {
            assert.isUndefined(conference.errors);
            assert.isUndefined(conference.valid);
          },
          'should remove the instance methods': function(err, conference) {
            assert.isUndefined(conference.toApi);
          },
          'should return the name, startdate, enddate, categories and details link': function(err, conference) {
            assert.deepEqual(conference, {
              name: 'techconf',
              startdate: '20110302',
              enddate: '20110304',
              categories: [{name: 'tech', details: 'http://localhost:3000/ws/categories/category-tech'}],
              details: 'http://localhost:3000/ws/conferences/conference-techconf'
            });
          }
        },
        'called with toDoc': {
          topic: function() {
            var conference = Conference.fromParams({categories: [{name: 'Nature'}]});
            var db = {
              view: function(design, view, options, callback) {
                if(design == 'category' && view == 'by_name' && options.keys[0] == 'Nature') {
                  callback(null, {rows: [{doc: {_id: 'category-nature'}}]})
                }
              }
            };
            conference.toDoc(db, this.callback);
          },
          'should replace the categories with category ids': function(err, conference) {
            assert.deepEqual(conference.category_ids, ['category-nature']);
          }
        }
      }
    }
  }).
  export(module);