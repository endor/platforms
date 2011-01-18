cap.app = $.sammy('body', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  this.helpers(cap.ApplicationHelper);
  this.swap = function(content) {
    $('#wrapper').html(content);
  };
  
  cap.Users(this);
  cap.Session(this);
  cap.Conferences(this);
  
  this.before(cap.SessionFilter);
  
  this.get('#/', function(context) {
    context.get('/ws/categories', function(categories) {
      context.get('/ws/conferences', function(conferences) {
        context.partial('views/categories/show.mustache', {categories: categories, conferences: conferences});        
      });
    });
  });
});

$(function() {
  cap.app.run('#/');
});