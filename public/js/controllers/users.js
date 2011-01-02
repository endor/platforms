skeleton.Users = function(app) {
  app.post('#/users', function(context) {
    context.post('/users', context.params, function() {
      context.redirect('#/test_results/new');
    }, function(errors) {
      context.partial('views/users/new.mustache');
      $.validator.showErrors(context.formatErrors(errors));
    });
  });
  
  app.get('#/users/new', function(context) {
    context.partial('views/users/new.mustache');
  });
}