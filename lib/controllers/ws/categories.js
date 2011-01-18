var Category = require('models/category');

module.exports = function(app) {
  app.get('/ws/categories', function(req, res) {
    app.db.view('category', 'top_level', {include_docs: true}, app.handleError(res, function(result) {
      if(result.rows.length == 0) {
        res.send([], 204);
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
      app.db.saveDoc(category.toDoc(), app.handleError(res, function(ok) {
        category.version = ok.rev;
        category.id = ok.id;
        res.send(category.toApi(), 200);
      }));
    } else {
      res.send({}, 400);
    };
  });
};