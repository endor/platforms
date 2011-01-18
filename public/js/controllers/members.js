// origin: M

cap.Members = function(app) {
  app.get('#/members/:username', function(context) {
    context.get('/ws/members/'+ this.params['username'], function(member) {
      context.partial('views/members/show.mustache', member);      
    })
  });
}