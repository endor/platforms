cap.SessionFilter = (function() {
  var allowed_routes = [
    {verb: 'get', path: /#\/users\/new/},
    {verb: 'post', path: /#\/users/},
    {verb: 'get', path: /#\/session\/new/},
    {verb: 'put', path: /#\/session/},
    {verb: 'get', path: /#\//}
  ],
  is_allowed_route = function(verb, path) {
    return _(allowed_routes).select(function(route) {
      return path.match(route.path) && route.verb == verb;
    }).length > 0;
  },
  logged_in = function() {
    if(cap.current_user.is_admin) { $('.show_when_admin').show(); }
    $('#login').hide();
    $('.show_when_logged_in').show();
  },
  logged_out = function() {
    $('.show_when_admin').hide();
    $('.show_when_logged_in').hide();
    $('#login').show();
  };
  
  return function(context) {
    if(!cap.current_user) {
      if(is_allowed_route(context.verb, context.path)) {
        logged_out();
      } else {
        context.get('/session', null, function(user) {
          cap.current_user = user;
          logged_in();
          cap.app.runRoute(context.verb, context.path, context.params, context.target);
        }, function() {
          context.redirect('#/session/new');
          logged_out();
        });

        return false;
      }
    } else {
      logged_in();
    }
  };
})();