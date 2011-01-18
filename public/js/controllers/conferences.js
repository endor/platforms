cap.Conferences = function(app) {
  app.get('#/conferences/new', function(context) {
    context.get('/ws/categories', function(categories) {
      context.partial('views/conferences/new.mustache', {categories: categories});      
    })
  });
  
  app.post('#/conferences', function(context) {
    context.post('/ws/conferences', context.params.conference, function(conference) {
      context.flash('Conference created successfully');
      context.redirect('#/conferences/' + conference.id);
    }, function(errors) {
      context.showErrors('#new_conference_form', context, errors);
    });
  });
  
  app.get('#/conferences/:id', function(context) {
    context.get('/ws/conferences/' + context.params.id, function(conference) {
      context.partial('views/conferences/show.mustache', conference);
    });
  });
}