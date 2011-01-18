cap.app = $.sammy('body', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  this.helpers(cap.ApplicationHelper);
  this.swap = function(content) {
    $('#wrapper').html(content);
  };
  
  cap.Users(this);
  cap.Session(this);
  
  this.before(cap.SessionFilter);
  
  this.get('#/', function(context) {
    context.get('/categories', function(categories) {
      context.get('/conferences', function(conferences) {
        context.partial('views/start.mustache', {categories: categories, conferences: conferences});        
      });
    });
  });
});

$(function() {
  cap.app.run('#/');
});