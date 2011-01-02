require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');
require.paths.unshift('lib');

var Skeleton = require('./lib/skeleton'),
  User = require('models/user');

App = function() {};
App.prototype = new Skeleton();
App.prototype.initializeRoutes = function(app) {
  app.get('/', function(req, res) {
    res.redirect('index.html');
  });
  
  app.post('/users', function(req, res) {
    var user = User.fromParams(req.body.user);
    if(user.valid()) {
      app.db.saveDoc(user.toDoc(), handleError(res, function(ok) {
        req.session.user_id = user.toDoc()._id;
        res.send(201);
      }));
    } else {
      res.send({user: user.errors}, 422);
    };
  });

  function handleError(res, callback) {
    return function() {
      var args = Array.prototype.slice.call(arguments); 
      var err = args.shift(); 

      if(!err) {
        callback.apply(null, args);
      } else {
        res.send(err, 500);
      };
    };
  }
};

new App().run({
  port: parseInt(process.env.PORT || 3000, 10),
  skip_update_views: process.env.SKIP_UPDATE_VIEWS
});