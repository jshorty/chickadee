Chickadee.Models.Question = Backbone.Model.extend({
  url: "/api/quizzes/",

  initialize: function () {
    this.listenTo(this, "change", this.buildUrl)
  },

  buildUrl: function () {
    this.url = "/api/quizzes/" + this.id
  },

  answerChoices: function () {
    return _.shuffle([
      (this.get('correct_answer')),
      (this.get('answer_a')),
      (this.get('answer_b')),
      (this.get('answer_c'))
    ]);
  }
});
