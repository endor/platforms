// origin: M
// handles requests to reset the database, fill it with the factorydefaults data

var couch_views = require('couch_views'),
  fs = require('fs');

module.exports = function(app) {
  app.get('/reset', function(req, res) {
    app.db.allDocs({include_docs: true}, app.handleError(res, function(result) {
      app.db.bulkDocs({docs: result.rows.map(function(row) {
        var doc = row.doc;
        doc._deleted = true;
        return doc;
        })}, app.handleError(res, function() {
          couch_views.update_views(app.db, _, function() {
            app.db.saveDoc(adminDoc(), app.handleError(res, function(ok) {
              res.send(204);
            }));
          });
      }));
    }));
  });
  
  app.get('/factorydefaults', function(req, res) {
    fs.readFile('factory_defaults.json', 'utf-8', function(err, file) {
      var categories = JSON.parse(file).categories;
      var conferences = JSON.parse(file).conferences;
      var members = JSON.parse(file).members;
      var total_size = categories.length + conferences.length + members.length;
      var count = 0;
      
      function countImport() {
        if(++count == total_size) {
          res.send(204);
        };
      }
      
      categories.forEach(function(category) {
        app.db.saveDoc(Category.fromParams(category).toDoc());
        countImport();
      });
      
      conferences.forEach(function(conference) {
        Conference.fromParams(conference).toDoc(app.db, function(err, doc) {
          if(err) {
            res.send(err, 500);
          } else {
            app.db.saveDoc(doc);
            countImport();
          }
        });
      });
      
      members.forEach(function(user) {
        app.db.saveDoc(User.fromParams(user).toDoc(), function(err) {
          if(err) {
            res.send(err, 500);
          } else {
            countImport();
          }
        });
      });
    });
  });
};

function adminDoc() {
  return User.fromParams({email: 'admin@admin.de', username: 'admin',
    fullname: 'admin', town: 'Nuernberg', country: 'Germany', password: 'admin'}).toDoc()
}