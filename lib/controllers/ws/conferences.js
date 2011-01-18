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
      res.send({}, 400);
    };
  });
  
  app.get('/ws/conferences', function(req, res) {
    app.db.view('conference', 'all', {include_docs: true}, function(err, results) {
      if(err) {
        res.send(err, 500);
      } else {
        res.send(results.rows.map(function(row) {return row.doc}));
      }
    });    
  });
};