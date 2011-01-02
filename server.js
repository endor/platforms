require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');

var Skeleton = require('./lib/skeleton');

App = function() {
  this.prototype = new Skeleton()
};

App.initializeRoutes = function(app) {
  app.get('/', function(req, res) {
    res.redirect('index.html');
  });
};

app = new App();