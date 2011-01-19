// origin: RM

var User = require('models/user');
module.exports = function(app) {
  app.get('/ws/members/:username', function(req, res) {
    var username = req.params.username,
    send_result = function(err, results) {
      if(err) {
        res.send(err, 500);
      } else {
        
        if(results.rows[0]){
          res.send(User.fromDoc(results.rows[0].doc).toApi());
        } else{
          res.send(404);
        }
      }};

    app.db.view('users', 'by_username', {include_docs: true, key: username}, send_result);
  });
  
  app.get('/ws/members', function(req, res) {
    app.db.view('users', 'by_username', {include_docs: true}, app.handleError(res, function(results) {
      var users = results.rows.map(function(row) { return User.fromDoc(row.doc).toApi(); });
      res.send(users, 200);
    }));
  });

  app.post('/ws/members', function(req, res) {
    var user = User.fromParams(req.body);
    if(user.valid()) {
      app.db.saveDoc(user.toDoc(), function(err, ok) {
        if(err) {
          if(err.error == 'conflict') {
            res.send({user: {username: ['is already taken.']}}, 400);
          } else {
            res.send(err);
          }
        } else {
          user.id = ok.id;
          req.session.user_id = ok.id;
          res.send(user.toApi(), 200);
        }
      });
    } else {
      res.send({user: user.errors}, 400);
    };
  });
};