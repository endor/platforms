skeleton.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/users', {user: context.params.user}, function() {
      context.redirect('#/test_results/new');
    }, function(errors) {
      context.partial('views/users/new.mustache');
      $('#new_user_form').validate().showErrors(context.formatErrors(errors));
    });
  });
  
  app.get('#/users/new', function(context) {
    context.partial('views/users/new.mustache');
  });
}