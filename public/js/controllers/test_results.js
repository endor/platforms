skeleton.TestResults = function(app) {
  app.get('#/test_results/new', function(context) {
    context.get('/questions', {}, function(questions) {
      context.partial('views/test_results/new.mustache', {questions: questions});
    });
  });
  
  app.post('#/test_results', function(context) {
    context.post('/test_results', context.params, function() {
      context.flash('You have successfully taken the test. Thanks.');
      context.redirect('#/');
    }, function() {
      context.showErrors('#new_test_result_form', context);
    });
  });
}