// origin: RM

cap.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/ws/members', context.params.user, function(user) {
      context.flash('Welcome ' + user.fullname);
      cap.current_user = user
      if(cap.current_user.username === 'admin') {
        cap.current_user.is_admin = true;
      }
      context.redirect('#/members/' + user.username);
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