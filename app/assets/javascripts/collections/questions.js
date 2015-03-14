Chickadee.Collections.Questions = Backbone.Collection.extend({
  url: "/api/quizzes",

  model: Chickadee.Models.Question,

  initialize: function (_, options) {
    this.quiz = options.quiz;
  }
});
