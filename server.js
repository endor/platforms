require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');
require.paths.unshift('lib');

var  User = require('models/user'),
  sys = require('sys');
  _ = require('./public/vendor/underscore/underscore')._,
  express = require('express/index'),
  connect = require('connect/index'),
  querystring = require('querystring'),
  couchdb = require('node-couchdb/lib/couchdb'),
  couch_views = require('couch_views'),
  cookie_sessions = require('cookie-sessions');

var couch_client,
  db_name = 'platforms';

var app = module.exports = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/../views');
  app.use(connect.bodyDecoder());
  app.use(connect.methodOverride());
  app.use(connect.cookieDecoder());
  app.use(cookie_sessions({secret: 'jhlvbUCVY7d978g08g*^&F64dxJYVouyv'}));
  app.use(app.router);
  app.use(connect.staticProvider(__dirname + '/public'));
  couch_client = couchdb.createClient(5984, 'localhost');
});

app.configure('development', function() {
  app.use(express.logger());    
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

if(!process.env.SKIP_UPDATE_VIEWS) {
  sys.puts('updating views. set SKIP_UPDATE_VIEWS to skip this');
  couch_views.update_views(app.db, _);
};

  
require('controllers/session')(app);
require('controllers/users')(app);
require('controllers/categories')(app);

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
};

if(!module.parent) {
  app.listen(parseInt(process.env.PORT || 3000, 10));
}
