skeleton.app = $.sammy('body', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  this.helpers(skeleton.ApplicationHelper);
  this.swap = function(content) {
    $('#wrapper').html(content);
  };
  
  skeleton.Users(this);
  skeleton.Session(this);
  
  // this.before(skeleton.SessionFilter);
  
  this.get('#/', function(context) {
    context.get('/categories', function(categories) {
      context.partial('views/start.mustache', {categories: categories});
    });
  });
});

$(function() {
  skeleton.app.run('#/');
});