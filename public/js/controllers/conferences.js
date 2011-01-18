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
    var details_link = $('#conference_' + context.params.id).attr('data-link');
    context.get(details_link, function(conference) {
      context.partial('views/conferences/show.mustache', conference);
    });
  });
  
  app.post('#/conferences/:id/attendees', function(context) {
    context.post('/ws/conferences/' + context.params.id + '/attendees', {username: cap.current_user.user.username}, function() {
      context.flash('You are attending this conference!');
      context.redirect('#/conferences/' + context.params.id);
    });
  });
}