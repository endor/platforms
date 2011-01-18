var Category = require('models/category');

module.exports = function(app) {
  app.post('/categories', function(req, res) {
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