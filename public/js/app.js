// origin: RM
// initializes the frontend

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
  cap.ConferenceSearch(this);
  
  this.before(cap.SessionFilter);
  
  this.get('#/', function(context) {
    context.get('/ws/categories', function(categories) {
      context.get('/ws/conferencesbycategory', function(conferences) {
        context.partial('views/categories/show.mustache', {
          categories: context.escapeDetails(categories),
          conferences: context.escapeDetails(conferences)
        });        
      });
    });
  });
});

$(function() {
  cap.app.run('#/');
});