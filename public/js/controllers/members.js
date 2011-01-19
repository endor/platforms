// origin: M

cap.Members = function(app) {
  app.get('#/members/:username', function(context) {
    var render_partial = function(member, contact_requests) {
      context.partial('views/members/show.mustache', _(member).extend({contact_requests: contact_requests}));
    };
    
    context.get('/ws/members/'+ context.params.username, function(member) {
      if(context.params.username === cap.current_user.username) {
        context.get('/contact_requests', function(contact_requests) {
          render_partial(member, contact_requests);
        });
      } else {
        render_partial(member, []);
      }
    });
  });
  
  app.get('#/members', function(context) {
    context.get('/ws/members', function(members) {
      members = members.filter(function(member) { return member.username !== cap.current_user.username; });
      context.partial('views/members/index.mustache', {members: members});
    });
  });
}