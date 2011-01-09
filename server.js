require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');
require.paths.unshift('lib');

var Skeleton = require('./lib/skeleton'),
  User = require('models/user'),
  QuestionProvider = require('models/question_provider');

App = function() {};
App.prototype = new Skeleton();
App.prototype.initializeRoutes = function(app) {
  app.get('/', function(req, res) {
    res.redirect('index.html');
  });
  
  app.post('/users', function(req, res) {
    var user = User.fromParams(req.body.user);
    if(user.valid()) {
      app.db.saveDoc(user.toDoc(), res, function(err, ok) {
        if(err) {
          console.log('ERROR', err);
          res.send(err);
        } else {
          console.log('SUCCESS');
          req.session.user_id = user.toDoc()._id;
          res.send(201);
        }
      });
    } else {
      res.send({user: user.errors}, 422);
    };
  });

  app.get('/questions', function(req, res) {
    var questions = QuestionProvider.read('questions.txt');
    
    res.send(questions, 200);
  });
  
  function handleError(res, callback) {
    return function() {
      var args = Array.prototype.slice.call(arguments); 
      var err = args.shift(); 

      if(!err) {
        callback.apply(null, args);
      } else {
        console.log(err)
        res.send(err, 500);
      };
    };
  }
};

new App().run({
  port: parseInt(process.env.PORT || 3000, 10),
  skip_update_views: process.env.SKIP_UPDATE_VIEWS
});