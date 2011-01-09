skeleton.Session = function(app) {
  app.put('#/session', function(context) {
    var session = {session: context.params.session};
    
    context.put('/session', session, function(user) {
      context.flash('Welcome back ' + context.params.user.username);
      context.redirect('#/');
      skeleton.current_user = user;
    }, function(errors) {
      context.showErrors('#new_session_form', context, errors);
    });
  });
  
  app.get('#/session/new', function(context) {
    context.partial('views/sessions/new.mustache');
  });
  
  app.del('#/session', function(context) {
    context.del('/session', null, function() {
      skeleton.current_user = null;
    });
  });
}