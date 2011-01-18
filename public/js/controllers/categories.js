cap.Categories = function(app) {
  app.get('#/categories/:name', function(context) {
    var details_link = $('#category_' + context.params.name).attr('data-link');
    context.get(details_link, function(category) {
      context.get('/ws/conferencesbycategory/' + category.id, function(conferences) {
        context.partial('views/categories/show.mustache', {categories: category.subcategories, conferences: conferences});
      });
    });
  });
}