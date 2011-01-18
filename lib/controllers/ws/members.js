var User = require('models/user');
module.exports = function(app) {
  app.get('/ws/members/:username', function(req, res) {
    var username = (req.params.username),
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
};