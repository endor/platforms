var User = require('models/user');

module.exports = function(app) {
  app.post('/ws/users', function(req, res) {
    var user = User.fromParams(req.body.user);
    if(user.valid()) {
      app.db.saveDoc(user.toDoc(), function(err, ok) {
        if(err) {
          if(err.error == 'conflict') {
            res.send({user: {username: ['is already taken.']}}, 400);
          } else {
            res.send(err);
          }
        } else {
          req.session.user_id = user.toDoc()._id;
          res.send(201);
        }
      });
    } else {
      res.send({user: user.errors}, 400);
    };
  });
};