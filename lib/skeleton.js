var _ = require('../public/vendor/underscore/underscore')._,
  express = require('express/index'),
  connect = require('connect/index'),
  querystring = require('querystring'),
  sys = require('sys'),
  couchdb = require('node-couchdb/lib/couchdb'),
  couch_views = require('./couch_views');

//
// options = { port: 8000 }
//
function Skeleton(options) {
};

Skeleton.prototype.run = function(options) {
  var app = this.createServer(options || {});
  this.configure(app);
  this.initializeHelpers(app);
  this.initializeRoutes(app);

  if(!options.skip_update_views) {
    sys.puts('updating views. set SKIP_UPDATE_VIEWS to skip this');
    couch_views.update_views(app.db, _);
  };
}

Skeleton.prototype.createServer = function(configuration) {
  var server = express.createServer();
  server.listen(configuration.port || 3000);
  sys.puts('RUNNING IN ' + (process.env.CONNECT_ENV || 'development') + ' environment')
  return server;
};

Skeleton.prototype.configure = function(app, configuration) {
  var couch_client,
    db_name = 'platforms';
  
  app.configure(function() {
    app.set('views', __dirname + '/../views');
    app.use(express.logger());
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.cookieDecoder());
    app.use(connect.session({secret: 'jhlvbUCVY7d978g08g*^&F64dxJYVouyv'}));
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/../public'));
    couch_client = couchdb.createClient(5984, 'localhost');
  });

  app.configure('development', function() {
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
    app.db = couch_client.db(db_name + '_development');
  });

  app.configure('test', function() {
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
    app.db = couch_client.db(db_name + '_test');
  });

  app.configure('production', function() {
    app.use(connect.errorHandler());
    app.db = couch_client.db(db_name + '_production');
  });
};

Skeleton.prototype.initializeHelpers = function(app) {
};

Skeleton.prototype.initializeRoutes = function(app) {
};

module.exports = Skeleton;