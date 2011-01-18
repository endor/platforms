var vows = require('vows'),
  assert = require('assert'),
  path = require('path'),
  QuestionProvider = require('../../lib/models/question_provider');

vows.
  describe('QuestionProvider').
  addBatch({
    'the QuestionProvider class': {
      'when reading a file': {
        topic: QuestionProvider.read(path.join(__dirname, '../fixtures/test_questions.txt')),
        
        'should return the contained questions': function(topic) {
          assert.deepEqual(topic[0], {question: 'How are you doing?', answer_1: 'Good', answer_2: 'Bad', id: 'question_0'});
          assert.deepEqual(topic[1], {question: 'Do you like animals?', answer_1: 'Yes', answer_2: 'No', id: 'question_1'});
        }
      }
    }
  }).
  export(module);