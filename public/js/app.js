var skeleton.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);

  this.helpers(skeleton.ApplicationHelper);
  
  skeleton.Users(this);
  skeleton.TestResults(this);
});

$(function() {
  skeleton.app.run('#/');
  skeleton.app.trigger('init');
});