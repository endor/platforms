cap.Conferences = function(app) {
  app.get('#/conferences/new', function(context) {
    context.get('/ws/categories', function(categories) {
      context.partial('views/conferences/new.mustache', {categories: categories});      
    })
  });
  
  app.post('#/conferences', function(context) {
    context.post('/ws/conferences', context.params.conference, function(conference) {
      context.flash('Conference created successfully');
      context.partial('views/conferences/show.mustache', conference);
    }, function(errors) {
      context.showErrors('#new_conference_form', context, errors);
    });
  });
}