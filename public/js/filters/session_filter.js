// origin: RM

cap.SessionFilter = (function() {
  var allowed_routes = [
    {verb: 'get', path: /#\/users\/new\/?$/},
    {verb: 'post', path: /#\/users\/?$/},
    {verb: 'get', path: /#\/session\/new\/?$/},
    {verb: 'put', path: /#\/session\/?$/},
    {verb: 'get', path: /#\/$/},
    {verb: 'get', path: /#\/conferences\/.+$/},
    {verb: 'get', path: /#\/categories\/.+$/},
    {verb: 'get', path: /#\/conference_search.*$/}
  ],
  is_allowed_route = function(verb, path) {
    return _(allowed_routes).select(function(route) {
      return path.match(route.path) && route.verb == verb;
    }).length > 0;
  },
  logged_in = function() {
    if(cap.current_user.username === 'admin') { $('.show_when_admin').show(); }
    $('.show_when_logged_out').hide();
    $('.show_when_logged_in').show();
    $('#profile a').attr('href', '#/members/' + cap.current_user.username);
  },
  logged_out = function() {
    $('.show_when_admin').hide();
    $('.show_when_logged_in').hide();
    $('.show_when_logged_out').show();
  };
  
  return function(context) {
    if(!cap.current_user) {
      context.get('/session', null, function(user) {
        cap.current_user = user;
        logged_in();
        cap.app.runRoute(context.verb, context.path, context.params, context.target);
      }, function() {
        logged_out();
        if(!is_allowed_route(context.verb, context.path)) {
          context.redirect('#/session/new');
          return false;
        }
      });
    } else {
      logged_in();
    }
  };
})();