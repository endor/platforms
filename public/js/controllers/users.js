cap.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/ws/users', {user: context.params.user}, function() {
      context.flash('Welcome ' + context.params.user.username + '. You can log in now.');
      context.redirect('#/');
    }, function(errors) {
      context.showErrors('#new_user_form', context, errors);
    });
  });
  
  app.get('#/users/new', function(context) {
    context.partial('views/users/new.mustache');
  });
}