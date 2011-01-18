var Category = require('models/category'),
  computeStatusCode = require('helpers/controller_helpers').computeStatusCode;

module.exports = function(app) {
  app.get('/ws/categories', function(req, res) {
    app.db.view('category', 'top_level', {include_docs: true}, app.handleError(res, function(result) {
      if(result.rows.length == 0) {
        res.send([], computeStatusCode(req, 204));
      } else {
        res.send(result.rows.map(function(row) {
          return Category.fromDoc(row.doc).toEmbeddedApi(req);
        }), 200);
      };
    }));
  });
  
  app.post('/ws/categories', function(req, res) {
    var category = Category.fromParams(req.body);
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
  });
};