var assert = require('assert'),
  sys = require('sys'),
  User = require('../lib/models/user');
  
module.exports = {
  'User.toId should prefix the username': function() {
    assert.equal('user-alex', User.toId('alex'));
  },
  'User should be invalid with invalid email': function() {
    var user = User.fromParams({email: 'joe'});
    assert.ok(!user.valid());
    assert.equal(user.errors.email[0], 'is not a valid email address.');
  },
  'User should be invalid without username': function() {
    var user = User.fromParams({});
    assert.ok(!user.valid());
    assert.equal(user.errors.username[0], "can't be blank.");
  },
  'User should be valid': function() {
    var user = User.fromParams({email: 'joe@doe.com', username: 'joe', town: 'Berlin',
      full_name: 'joe doe', life_motto: 'go with the flow', password: 'test'});
    assert.ok(user.valid());
  },
  'User.fromParams should encrypt password': function() {
    var user = User.fromParams({password: 'test'});
    assert.ok(user.encrypted_password.length > 0);
  },
  'User#toDoc should remove the unencrypted password': function() {
    var user = User.fromParams({password: 'test'});
    assert.ok(user.toDoc().password == undefined);
  },
  'User#toDoc should remove all functions': function() {
    var user = User.fromParams({});
    assert.ok(user.toDoc().authenticate == undefined);
  },
  'User#authenticate should return true if password matches': function() {
    var user = User.fromParams({password: 'test'});
    assert.ok(user.authenticate('test'));
  },
  'User#authenticate should return false if password doesn\'t match': function() {
    var user = User.fromParams({password: 'test'});
    assert.ok(!user.authenticate('xyz'));
  },
  'User.fromDoc should add authenticate method': function() {
    var user = User.fromDoc({});
    assert.equal(typeof(user.authenticate), 'function');
  }
};