QuestionProvider = require('models/question_provider');

module.exports = function(app) {
  app.get('/questions', function(req, res) {
    var questions = QuestionProvider.read('questions.txt');
    
    res.send(questions, 200);
  });
};