cap.Session = function(app) {
  app.put('#/session', function(context) {
    var session = {session: context.params.session};
    
    context.put('/session', session, function(user) {
      cap.current_user = user;
      context.flash('Welcome back ' + context.params.session.username);
      
      if(cap.requestBeforeSessionTimeout) {
        var _context = cap.requestBeforeSessionTimeout;
        cap.app.runRoute(_context.verb, _context.path, _context.params, _context.target); 
        cap.requestBeforeSessionTimeout = null;
      } else {
        context.redirect('#/');
      }
    }, function(errors) {
      context.showErrors('#new_session_form', context, errors);
    });
  });
  
  app.get('#/session/new', function(context) {
    context.partial('views/sessions/new.mustache');
  });
  
  app.del('#/session', function(context) {
    context.del('/session', null, function() {
      cap.current_user = null;
      context.redirect('#/');
    });
  });
}