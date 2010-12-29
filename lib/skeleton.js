var _ = require('../public/js/underscore')._,
  express = require('express/index'),
  connect = require('connect/index'),
  querystring = require('querystring'),
  sys = require('sys'),
  node_mail = require('node-mail/lib/mail/index');
  couchdb = require('node-couchdb/lib/couchdb'),
  couch_views = require('./couch_views'),
  Model = require('./models/model').Model;

//
// options = { port: 8000 }
//
function Skeleton(options) {
  var app = this.createServer();
  this.configure(app);
  this.initializeHelpers(app);
  this.initializeRoutes(app);

  if(!process.env.SKIP_UPDATE_VIEWS) {
    sys.puts('updating views. set SKIP_UPDATE_VIEWS to skip this');
    couch_views.update_views(app.db, _);
  };
};

Skeleton.prototype.createServer = function(configuration) {
  var server = express.createServer();
  server.listen(3000);
  sys.puts('RUNNING IN ' + (process.env.EXPRESS_ENV || 'development') + ' environment')
  return server;
};

Skeleton.prototype.configure = function(app, configuration) {
  var couch_client,
    db_name = 'skeleton';
  
  app.configure(function() {
    app.set('views', __dirname + '/../views');
    app.use(express.logger());
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/../public'));
    app.set('host', 'localhost:3000');
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
  app.helpers({
    host: app.settings.host
  });
};

Skeleton.prototype.initializeRoutes = function(app) {
  app.put('/update_views', function(req, res) {
    couch_views.update_views(app.db, _);
    res.send(201);
  });

  app.get('/', function(req, res) {
    res.render('index.ejs');  
  });

  app.get('/something', function(req, res) {
    app.db.view('design_doc', 'view', {startkey: req.query.q, endkey: req.query.q + "\u9999", limit: 20, group: true}, function(err, results) {
      if(err) {
        send_error(res, err);
      } else {
        send_success(res, results.rows.map(function(row) {return row.key}).join("\n"));
      }
    })
  });

  app.post('/other', function(req, res) {
    var doc = Model.from_params(req.body);
    app.db.saveDoc(doc, function(_err, ok) {
      if(_err) {
        send_error(res, _err);
      } else {
        doc._id = ok.id;
        doc._rev = ok.rev;
        res.send(doc, 201);
      }
    });
  });

  function send_error(res, err) {
    res.send(JSON.stringify(err), 500);
  };
  
  function send_success(res, obj) {
    res.send(obj, 200);
  }  
};

module.exports = Skeleton;