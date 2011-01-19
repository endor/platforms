// origin: M

var Conference = require('models/conference'),
  Attendance = require('models/attendance'),
  computeStatusCode = require('helpers/controller_helpers').computeStatusCode;

module.exports = function(app) {
  app.get('/ws/conferencesbycategory', function(req, res) {
    app.db.view('conference', 'all', {include_docs: true}, app.handleError(res, function(results) {
      sendConferences(results, req, res);
    }));
  });
  
  app.get('/ws/conferencesbycategory/:category_id', function(req, res) {
    var category_id = req.params.category_id;
    app.db.getDoc(category_id, function(err) {
      if(err) {
        res.send(404);
      } else {
        app.db.view('conference', 'by_category_id', {include_docs: true, key: category_id}, app.handleError(res, function(results) {
          sendConferences(results, req, res);
        }));
      }
    })
  });
  
  function sendConferences(results, req, res) {
    var count = results.rows.length,
      conferences = [];
    if(results.rows.length == 0) {
      res.send([], computeStatusCode(req, 204));
    } else {
      results.rows.forEach(function(row) {
        Conference.fromDoc(row.doc).toEmbeddedApi(req, app.db, app.handleError(res, function(conference) {
          conferences.push(conference);
          if(conferences.length == count) {
            res.send(conferences);
          };
        }));
      });
    }
  }
  
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
    app.db.getDoc(req.params.id, app.handleError(res, function(doc) {
      var conference = Conference.fromDoc(doc);
      res.send(conference.toApi(), 200);      
    }));
  });
  
  app.post('/ws/conferences/:id/attendees', function(req, res) {
    app.db.getDoc(req.params.id, app.handleError(res, function(doc) {
      var conference = Conference.fromDoc(doc);

      if(req.body.username === req.session.username) {
        var attendance = Attendance.fromParams(req.body.username, req.params.id);

        attendance.toDoc(app.db, app.handleError(res, function(doc) {
          app.db.saveDoc(doc, app.handleError(res, function(ok) {
            res.send({}, computeStatusCode(req, 204));   
          }));
        }));
      } else {
        res.send({}, 403);
      }
    }));  
  });
};