skeleton.TestResults = function(app) {
  app.get('#/test_results/new', function(context) {
    context.get('/questions', {}, function(questions) {
      context.partial('views/test_results/new.mustache', questions);      
    });
  });
  
  app.post('#/test_results', function(context) {
    context.post('/test_results', context.params, function() {
      
    }, function() {
      
    });
  });
}