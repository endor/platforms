var vows = require('vows'),
  assert = require('assert'),
  User = require('../../lib/models/user');
    
var isInvalid = function(topic) {
  assert.isFalse(topic.valid());
};

vows.
  describe('User').
  addBatch({
    'the User class': {
      'called with toId': {
        topic: User.toId('alex'),
        
        'should prefix the name': function(topic) {
          assert.equal(topic, 'user-alex');
        }
      }
    },
    'a User': {
      'initialized through fromDoc': {
        topic: User.fromDoc({}),
        
        'should add the authenticate method': function(topic) {
          assert.isFunction(topic.authenticate);
        }
      },
      'with an invalid email': {
        topic: User.fromParams({email: 'joe'}),
        
        'is invalid': isInvalid,
        
        'has an error on the email': function(topic) {
          assert.equal(topic.errors.email[0], 'is not a valid email address.');
        }
      },
      'without a username': {
        topic: User.fromParams({}),
        
        'is invalid': isInvalid,
        
        'has an error on the username': function(topic) {
          assert.equal(topic.errors.username[0], "can't be blank.");
        }
      },
      'with all attributes set correctly': {
        topic: User.fromParams({email: 'joe@doe.com', username: 'joe', town: 'Berlin',
          fullname: 'joe doe', password: 'test', country: 'germany'}),

        'is valid': function(topic) {
          assert.isTrue(topic.valid());
        },
        
        'should encrypt the password': function(topic) {
          assert.isTrue(topic.encrypted_password.length > 0);
        },
        
        'should authenticate with the correct password': function(topic) {
          assert.isTrue(topic.authenticate('test'));
        },
        
        'should not authenticate with the incorrect password': function(topic) {
          assert.isFalse(topic.authenticate('xyz'));
        },
        
        'called with toDoc': {
          topic: function(user) { return user.toDoc() },
          
          'should remove the unencrypted password': function(topic) {
            assert.isUndefined(topic.password);
          },
          
          'should remove all functions': function(topic) {
            assert.isUndefined(topic.authenticate);
          }
        }
      }
    }
  }).
  export(module);