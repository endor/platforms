skeleton.SessionFilter = function() {
  if(!skeleton.current_user) {
    this.get('/session', null, function(user) {
      skeleton.current_user = user;
      
      $('#login').hide();
      $('#logout').show();
    }, function() {
      $('#logout').hide();
      $('#login').show();      
    });
  } else {
    $('#login').hide();
    $('#logout').show();    
  }
}