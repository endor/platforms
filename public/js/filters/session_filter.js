skeleton.SessionFilter = (function() {
  var allowed_routes = [
    {verb: 'get', path: '#/users/new'},
    {verb: 'post', path: '#/users'},
    {verb: 'get', path: '#/session/new'},
    {verb: 'put', path: '#/session'}
  ];
  
  return function(context) {
    if(!skeleton.current_user) {
      if(_(allowed_routes).select(function(obj) {
        return obj.path == context.path && obj.verb == context.verb;
      }).length > 0) {
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
  };
})();