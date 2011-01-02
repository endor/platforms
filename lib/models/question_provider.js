var fs = require('fs'),
  _ = require('../../public/vendor/underscore/underscore')._;

module.exports = {
  read: function(file) {
    var i = 0, lines = fs.readFileSync(file, 'utf-8').split(/\n/);
    return lines.reduce(function(questions, line, j) {
      var question = questions[questions.length - 1];
      if(_(question).size() === 0) {
        question.question = line;
      } else if(_(question).size() === 1) {
        question.answer_1 = line;
      } else if(_(question).size() === 2) {
        question.answer_2 = line;
      } else if(_(question).size() === 3) {
        question.id = 'question_' + i++;
        if(j < lines.length - 1) {
          questions.push({});
        };
      };
      return questions;
    }, [{}]);
  }
};
