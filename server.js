// origin: RM

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
  cookie_sessions = require('cookie-sessions'),
  user_authentication_middleware = require('user_authentication_middleware');

var couch_client,
  db_name = 'platforms';

var app = module.exports = express.createServer();

app.configure('development', function() {
  configure_app('development');
  app.use(express.logger());    
  app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function() {
  configure_app('test');
  app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  configure_app('production');
  app.use(connect.errorHandler());
});



function configure_app(env) {
  couch_client = couchdb.createClient(5984, 'localhost');
  app.db = couch_client.db(db_name + '_' + env);
  app.configure(function() {
    app.set('views', __dirname + '/../views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.cookieDecoder());
    app.use(connect.staticProvider(__dirname + '/public'));
    app.use(cookie_sessions({secret: 'jhlvbUCVY7d978g08g*^&F64dxJYVouyv'}));
    app.use(user_authentication_middleware(app.db)); //filter routes that require a login
    app.use(app.router);
  });
  
}


require('controllers/session')(app);
require('controllers/ws/categories')(app);
require('controllers/ws/conferences')(app);
require('controllers/ws/members')(app);
require('controllers/ws/search')(app);
require('controllers/reset')(app);
require('controllers/contact_requests')(app);


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
      if(err.error === 'not_found') {
        res.send(err, 404);
      } else {
        res.send(err, 500);
      }
    };
  };
};

if(!module.parent) {
  app.listen(parseInt(process.env.PORT || 3000, 10));
}
