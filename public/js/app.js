skeleton.app = $.sammy('#wrapper', function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  
  this.helpers(skeleton.ApplicationHelper);
  
  skeleton.Users(this);
  skeleton.TestResults(this);
  skeleton.Session(this);
  
  this.before(function() {
    if(!skeleton.current_user) {
      this.get('/session', null, function(user) {
        skeleton.current_user = user;
      });
    }
    
    if(skeleton.current_user) {
      $('#login').hide()
      $('#logout').show()
    } else {
      $('#logout').hide()
      $('#login').show()      
    }
  });
  
  this.get('#/', function() {
    this.partial('views/start.mustache');
  });
});

$(function() {
  skeleton.app.run('#/');
});