// origin: M

cap.ContactRequests = function(app) {
  app.post('#/contact_requests', function(context) {
    var data = {
      target_username: context.params.target_username,
      source_username: cap.current_user.username,
      source_user_id: cap.current_user._id
    };
    context.post('/contact_requests', data, function() {
      context.flash("Successfully sent contact request to " + context.params.target_username);
      context.redirect('#/members/' + cap.current_user.username);      
    }, function() {
      context.flash(context.params.target_username + " could not be added as a contact.");
    });
  });
  
  app.put('#/contact_requests/:id', function(context) {
    context.put('/contact_requests/' + context.params.id, context.params.contact_request, function(contact_request) {
      if(contact_request.accepted) {
        context.flash("Successfully created contact with " + contact_request.target_username);
        context.redirect('#/members/' + contact_request.source_username);
      }
    }, function() {
      context.flash("Unable to accept contact request.");
    });
  });
};