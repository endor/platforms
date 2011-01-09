var User = require('models/user');

module.exports = function(app) {
  app.get('/session', function(req, res) {
    if(req.session.user_id) {
      app.db.getDoc(req.session.user_id, app.handleError(res, function(user) {
        res.send({user: user}, 200);
      }));
    } else {
      res.send({}, 404);
    };
  });
  
  app.del('/session', function(req, res) {
    req.session.user_id = null;
    res.send({}, 200);
  });
  
  app.put('/session', function(req, res) {
    app.db.getDoc(User.toId(req.body.session.username), function(err, user) {
      if(err) {
        res.send({session: {username: ['not found.']}}, 422);
      } else {
        if(user.authenticate(req.body.session.password)) {
          res.send({user: user}, 201);
        } else {
          res.send({session: {password: ['does not match the password on record.']}}, 422);
        }
      }
    });
  });
};