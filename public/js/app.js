// origin: RM

cap.app = $.sammy('body', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.helpers(cap.ApplicationHelper);

  this.swap = function(content) {
    $('#wrapper').html(content);
  };

  this.clearTemplateCache();
  cap.Members(this);
  cap.Users(this);
  cap.Session(this);
  cap.Conferences(this);
  cap.Categories(this);
  cap.ContactRequests(this);
  
  this.before(cap.SessionFilter);
  
  this.get('#/', function(context) {
    context.get('/ws/categories', function(categories) {
      context.escapeDetails(categories, _);
      context.get('/ws/conferencesbycategory', function(conferences) {
        context.escapeDetails(conferences, _);
        context.partial('views/categories/show.mustache', {categories: categories, conferences: conferences});        
      });
    });
  });
});

$(function() {
  cap.app.run('#/');
});