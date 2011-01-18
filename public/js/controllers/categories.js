cap.Categories = function(app) {
  app.get('#/categories/:id', function(context) {
    var details_link = $('#category_' + context.params.id).attr('data-link');
    context.get(details_link, function(category) {
      context.get('/ws/conferencesbycategory/' + category.id, function(conferences) {
        context.partial('views/categories/show.mustache', {categories: category.subcategories, conferences: conferences});
      });
    });
  });
}