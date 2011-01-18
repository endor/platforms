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
};