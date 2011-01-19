// origin: M

cap.Members = function(app) {
  app.get('#/members/:username', function(context) {
    context.get('/ws/members/'+ this.params['username'], function(member) {
      context.partial('views/members/show.mustache', member);      
    });
  });
  
  app.get('#/members', function(context) {
    context.get('/ws/members', function(members) {
      context.partial('views/members/index.mustache', {members: members});
    });
  });
}