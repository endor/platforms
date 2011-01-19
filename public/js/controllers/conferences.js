// origin: M
// handles requests for creating/listing conferences

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
     var details_link = cap.details_link || context.detailLinkFromDetails(context.params.id);
    cap.details_link = null;
    context.get(details_link, function(conference) {
      context.get('/ws/conferences/' + conference.id + '/attendees', function(attendees) {
        conference.categories_string = _(conference.categories).map(function(category) { return category.name; }).join(', ');
        var conference_with_attendees = _(conference).extend({attendees: attendees});
        if(cap.current_user) {
          conference_with_attendees.already_attending = context.alreadyAttending(attendees, _);
        }
        context.partial('views/conferences/show.mustache', conference_with_attendees);
      });
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