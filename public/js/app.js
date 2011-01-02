skeleton.app = $.sammy('#wrapper', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  this.helpers(skeleton.ApplicationHelper);
  
  skeleton.Users(this);
  skeleton.TestResults(this);
  
  this.get('#/', function() {
    this.partial('views/start.mustache');
  });
});

$(function() {
  skeleton.app.run('#/');
});