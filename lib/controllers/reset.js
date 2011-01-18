var couch_views = require('couch_views');

module.exports = function(app) {
  app.post('/reset', function(req, res) {
    app.db.allDocs({include_docs: true}, function(err, result) {
      app.db.bulkDocs({docs: result.rows.map(function(row) {
        var doc = row.doc;
        doc._deleted = true;
        return doc;
        })}, function() {
          couch_views.update_views(app.db, _, function() {
            res.send(204);
          });
      });
    });
  });
};