var Category = require('models/category'),
  computeStatusCode = require('helpers/controller_helpers').computeStatusCode;

module.exports = function(app) {
  app.get('/ws/categories', function(req, res) {
    app.db.view('category', 'top_level', {include_docs: true}, app.handleError(res, function(result) {
      if(result.rows.length === 0) {
        res.send([], computeStatusCode(req, 204));
      } else {
        res.send(result.rows.map(function(row) {
          return Category.fromDoc(row.doc).toEmbeddedApi(req);
        }), 200);
      };
    }));
  });

  app.get('/ws/categories/:id', function(req, res) {
    app.db.getDoc(req.params.id, function(err, doc) {
      app.db.view('category', 'by_parent_id', {include_docs: true, key: req.params.id}, app.handleError(res, function(categories) {
        var category = Category.fromDoc(doc);
        category.subcategories = categories;
        res.send(category.toApi(), 200);
      }));
    });
  });
  
  app.post('/ws/categories', function(req, res) {
    var validate_and_send_result = function(category, req, res) {
      if(category.valid()) {
        app.db.saveDoc(category.toDoc(), function(err, ok) {
          if(err) {
            res.send(err, 500);
          } else {
            category.version = ok.rev;
            category.id = ok.id;
            res.send(category.toApi(), 200);
          }
        });
      } else {
        res.send({}, 400);
      };      
    };
    
    var category = Category.fromParams(req.body);
    if(category.parent) {
      app.db.view('category', 'top_level', {include_docs: true, key: category.parent.name}, function(err, ok) {
        if(err) {
          res.send(err, 500);
        } else {
          if(ok.rows.length > 0) {
            category.parent_id = ok.rows[0].id;
          };
          delete category.parent;
          validate_and_send_result(category, req, res);
        }
      });
    } else {
      validate_and_send_result(category, req, res);
    }
  });
};