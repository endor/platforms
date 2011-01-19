// origin: M

cap.Conferences = function(app) {
  app.get('#/conferences/new', function(context) {
    context.get('/ws/categories', function(categories) {
      context.partial('views/conferences/new.mustache', {categories: categories});      
    })
  });
  
  app.post('#/conferences', function(context) {
    context.post('/ws/conferences', context.params.conference, function(conference) {
      context.flash('Conference created successfully');
      cap.details_link = '/ws/conferences/' + conference.id;
      context.redirect('#/conferences/' + conference.id);
    }, function(errors) {
      context.showErrors('#new_conference_form', context, errors);
    });
  });
  
  app.get('#/conferences/:id', function(context) {
    var details_link = cap.details_link || $('#conference_' + context.params.id).attr('data-link');
    cap.details_link = null;
    context.get(details_link, function(conference) {
      context.partial('views/conferences/show.mustache', conference);
    });
  });
  
  app.post('#/conferences/:id/attendees', function(context) {
    // TODO: do not update the conference document
    // but create an attendance object
    context.post('/ws/conferences/' + context.params.id + '/attendees', {username: cap.current_user.username}, function() {
      context.flash('You are attending this conference!');
      cap.details_link = '/ws/conferences/' + conference.id;
      context.redirect('#/conferences/' + context.params.id);
    });
  });
}