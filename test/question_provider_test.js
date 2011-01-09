var assert = require('assert'),
  sys = require('sys'),
  path = require('path'),
  QuestionProvider = require('../lib/models/question_provider');
  
module.exports = {
  'QuestionProvider returns questions': function() {
    assert.eql(QuestionProvider.read(path.join(__dirname, 'test_questions.txt')), [
      {question: 'How are you doing?', answer_1: 'Good', answer_2: 'Bad', id: 'question_0'},
      {question: 'Do you like animals?', answer_1: 'Yes', answer_2: 'No', id: 'question_1'}
    ]);
  }
};