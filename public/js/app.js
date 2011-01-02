var skeleton.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);

  this.get('#/users/new', function() {
    this.render('views/users/new.mustache');
  });
});

$(function() {
  skeleton.app.run('#/');
  skeleton.app.trigger('init');
});