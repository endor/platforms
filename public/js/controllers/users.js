skeleton.Users = function(app) {
  app.post('#/users', function(context) {
    this.post('/users', this.params, function() {
      context.redirect('#/test_results/new');
    }, function() {
      context.partial('views/users/new.mustache');
    });
  });
  
  app.get('#/users/new', function() {
    this.partial('views/users/new.mustache');
  });
}