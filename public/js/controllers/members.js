// origin: M

cap.Members = function(app) {
  app.get('#/members/:username', function(context) {
    var render_partial = function(member, sent_contact_requests, received_contact_requests) {
      context.partial('views/members/show.mustache', _(member).extend({
        sent_contact_requests: sent_contact_requests,
        received_contact_requests: received_contact_requests
      }));
    };
    
    context.get('/ws/members/'+ context.params.username, function(member) {
      if(context.params.username === cap.current_user.username) {
        context.get('/sent_contact_requests', function(sent_contact_requests) {
          context.get('/received_contact_requests', function(received_contact_requests) {
            render_partial(member, sent_contact_requests, received_contact_requests);
          });        
        });
      } else {
        render_partial(member, [], []);
      }
    });
  });
  
  app.get('#/members', function(context) {
    context.get('/ws/members', function(members) {
      context.get('/sent_contact_requests', function(contact_requests) {
        var formatted_members = [];
        
        contact_requests = contact_requests.map(function(cr) { return cr.target_username; });
        members.forEach(function(member) {
          if(member.username !== cap.current_user.username) {
            formatted_members.push(_(member).extend({show_name: (contact_requests.indexOf(member.username) > -1) }));
          }
        });

        context.partial('views/members/index.mustache', {members: formatted_members});        
      });
    });
  });
}