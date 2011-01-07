skeleton.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/users', {user: context.params.user}, function() {
      context.flash('Welcome ' + context.params.user.username);
      context.redirect('#/test_results/new');
    }, function(errors) {
      context.showErrors('#new_user_form', context, errors);
    });
  });
  
  app.get('#/users/new', function(context) {
    context.partial('views/users/new.mustache');
  });
}