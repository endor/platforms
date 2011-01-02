skeleton.Users = function(app) {
  app.post('#/users', function() {
    
  });
  
  app.get('#/users/new', function() {
    this.render('views/users/new.mustache');
  });
}