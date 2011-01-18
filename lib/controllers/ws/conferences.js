var Conference = require('models/conference');

module.exports = function(app) {
  app.get('/ws/conferencesbycategory', function(req, res) {
    app.db.view('conference', 'all', {include_docs: true}, app.handleError(res, function(results) {
      var count = results.rows.length,
        conferences = [];
      results.rows.forEach(function(row) {
        Conference.fromDoc(row.doc).toEmbeddedApi(req, app.db, app.handleError(res, function(conference) {
          conferences.push(conference);
          if(conferences.length == count) {
            res.send(conferences);
          };
        }));
      });
    }));
  });
  
  app.post('/ws/conferences', function(req, res) {
    var conference = Conference.fromParams(req.body);
    if(conference.valid()) {
      conference.toDoc(app.db, app.handleError(res, function(doc) {
        app.db.saveDoc(doc, app.handleError(res, function(ok) {
          conference.version = ok.rev;
          conference.id = ok.id;
          res.send(conference.toApi(), 200);
        }));
      }));
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
};