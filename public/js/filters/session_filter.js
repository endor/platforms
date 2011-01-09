skeleton.SessionFilter = function(context) {
  if(!skeleton.current_user) {
    if(['#/users/new', '#/session/new', '#/session'].indexOf(context.path) >= 0) {
      $('#logout').hide();
      $('#login').show();      
    } else {
      context.get('/session', null, function(user) {
        skeleton.current_user = user;
        $('#login').hide();
        $('#logout').show();
        skeleton.app.runRoute(context.verb, context.path, context.params, context.target);
      }, function() {
        context.redirect('#/session/new');
        $('#logout').hide();
        $('#login').show();
      });

      return false;
    }
  } else {
    $('#login').hide();
    $('#logout').show();    
  }
}