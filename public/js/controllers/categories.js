// origin: M

cap.Categories = function(app) {
  app.get('#/categories/new', function(context) {
    context.get('/ws/categories', function(categories) {
      context.partial('views/categories/new.mustache', {categories: categories});
    });
  });

  app.get('#/categories/:id', function(context) {
    var details_link = context.detailLinkFromDetails(context.params.id);
    context.get(details_link, function(category) {
      context.escapeDetails(category.subcategories, _);
      context.get('/ws/conferencesbycategory/' + category.id, function(conferences) {
        context.escapeDetails(conferences, _);
        context.partial('views/categories/show.mustache', {categories: category.subcategories, conferences: conferences});
      });
    });
  });
  
  app.post('#/categories', function(context) {
    context.post('/ws/categories', context.params.category, function(category) {
      context.flash('Category successfully created');
      context.redirect('#/');
    });
  });
};