cap.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/ws/users', context.params.user, function(user) {
      context.flash('Welcome ' + user.fullname);
      cap.current_user = user
      context.redirect('#/');
    }, function(errors) {
      context.showErrors('#new_user_form', context, errors);
    });
  });
  
  app.get('#/users/new', function(context) {
    context.partial('views/users/new.mustache');
  });
  
  app.get('#/users/:id', function(context) {
    context.get('/ws/users/' + context.params.id, function(user) {
      context.partial('views/users/show.mustache', user);      
    });
  });
}