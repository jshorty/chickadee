Chickadee.Models.Question = Backbone.Model.extend({
  urlRoot: "/api/quizzes",

  answerChoices: function () {
    return _.shuffle([
      (this.get('correct_answer')),
      (this.get('answer_a')),
      (this.get('answer_b')),
      (this.get('answer_c'))
    ]);
  }
});
