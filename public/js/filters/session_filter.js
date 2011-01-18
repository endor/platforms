cap.SessionFilter = (function() {
  var allowed_routes = [
    {verb: 'get', path: '#/users/new'},
    {verb: 'post', path: '#/users'},
    {verb: 'get', path: '#/session/new'},
    {verb: 'put', path: '#/session'}
  ],
  is_allowed_route = function(verb, path) {
    return _(allowed_routes).select(function(route) {
      return route.path == path && route.verb == verb;
    }).length > 0;
  };
  
  return function(context) {
    if(!cap.current_user) {
      if(is_allowed_route(context.verb, context.path)) {
        $('.show_when_logged_in').hide();
        $('#login').show();      
      } else {
        context.get('/session', null, function(user) {
          cap.current_user = user;
          $('#login').hide();
          $('.show_when_logged_in').show();
          cap.app.runRoute(context.verb, context.path, context.params, context.target);
        }, function() {
          context.redirect('#/session/new');
          $('.show_when_logged_in').hide();
          $('#login').show();
        });

        return false;
      }
    } else {
      $('#login').hide();
      $('.show_when_logged_in').show();    
    }
  };
})();