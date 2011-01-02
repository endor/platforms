var skeleton.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);

  skeleton.Users(this);  
});

$(function() {
  skeleton.app.run('#/');
  skeleton.app.trigger('init');
});