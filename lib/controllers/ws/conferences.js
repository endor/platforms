var Conference = require('models/conference');

module.exports = function(app) {
  app.post('/ws/conferences', function(req, res) {
    var conference = Conference.fromParams(req.body);
    if(conference.valid()) {
      app.db.saveDoc(conference.toDoc(), function(err, ok) {
        if(err) {
          res.send(err, 500);
        } else {
          conference.version = ok.rev;
          conference.id = ok.id;
          res.send(conference.toApi(), 200);
        }
      });
    } else {
      res.send({conference: conference.errors}, 400);
    };
  });

  app.get('/ws/conferences/:id', function(req, res) {
    app.db.getDoc(req.params.id, function(err, doc) {
      if(err) {
        res.send(err, 500);
      } else {
        var conference = Conference.fromParams(doc);
        res.send(conference.toApi(), 200);
      }
    });
  });

  app.get('/ws/conferences', function(req, res) {
    var send_result = function(err, results) {
      if(err) {
        res.send(err, 500);
      } else {
        res.send(results.rows.map(function(row) {return row.doc}));
      };
    };
    
    if(req.query.category) {
      app.db.view('conference', 'by_category', {include_docs: true, key: req.query.category}, send_result);
    } else {
      app.db.view('conference', 'all', {include_docs: true}, send_result);
    }
  });
};