require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');

var Skeleton = require('./lib/skeleton');

App = function(conf) {
  this.prototype = new Skeleton(conf)
};

App.initializeRoutes = function(app) {
  app.get('/', function(req, res) {
    res.redirect('index.html');
  });
};

app = new App({port: parseInt(process.env.PORT || 3000, 10)});