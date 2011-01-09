require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');
require.paths.unshift('lib');

var Skeleton = require('./lib/skeleton'),
  User = require('models/user'),
  sys = require('sys');

App = function() {};
App.session = require('controllers/session');
App.users = require('controllers/users');
App.questions = require('controllers/questions');

App.prototype = new Skeleton();
App.prototype.initializeRoutes = function(app) {
  App.session(app);
  App.users(app);
  App.questions(app);
  
  app.get('/', function(req, res) {
    res.redirect('index.html');
  });
  app.handleError = function(res, callback) {
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