skeleton.SessionFilter = function() {
  if(!skeleton.current_user) {
    this.get('/session', null, function(user) {
      skeleton.current_user = user;
      
      if(skeleton.current_user) {
        $('#login').hide()
        $('#logout').show()
      } else {
        $('#logout').hide()
        $('#login').show()      
      }
    });
  }
}