cap.Categories = function(app) {
  app.get('#/categories/:id', function(context) {
    context.get('/ws/categories/' + context.params.id, function(category) {
      context.get('/ws/conferencesbycategory/' + context.params.id, function(conferences) {
        context.partial('views/categories/show.mustache', {categories: category.subcategories, conferences: conferences});
      });
    });
  });
}