skeleton.Users = function(app) {
  app.post('#/users', function(context) {
    this.post('/users', this.params, function() {
      
    }, function() {
      context.render('');
    });
  });
  
  app.get('#/users/new', function() {
    this.render('views/users/new.mustache');
  });
}