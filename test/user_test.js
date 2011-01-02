var sys = require('sys'),
  User = require('../lib/models/user');
  
module.exports = {
  'User should be invalid with invalid email': function(assert) {
    var user = User.fromParams({email: 'joe'});
    assert.ok(!user.valid());
    assert.equal(user.errors.email[0], 'is not a valid email address.');
  },
  'User should be invalid without username': function(assert) {
    var user = User.fromParams({});
    assert.ok(!user.valid());
    assert.equal(user.errors.username[0], "can't be blank.");
  },
  'User should be valid': function(assert) {
    var user = User.fromParams({email: 'joe@doe.com', username: 'joe', town: 'Berlin',
      full_name: 'joe doe', life_motto: 'go with the flow', password: 'test'});
    assert.ok(user.valid());
  }
};

