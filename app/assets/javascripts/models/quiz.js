Chickadee.Models.Quiz = Backbone.Model.extend({
  urlRoot: "/api/quizzes",

  questions: function(){
    if (!this._questions) {
      this._questions = new Chickadee.Collections.Questions(
        [], {quiz: this}
      );
    }
    return this._questions;
  },

  parse: function(payload){
    if (payload.questions) {
      debugger
      var questions = this.questions().set(payload.questions);
      delete payload.questions;
    }
    return payload;
  },

  checkIfComplete: function () {
    var complete = true;
    this.questions().each(function(question){
      if (!question.get('answered')) {
        complete = false;
      }
    });
    return complete;
  },

  nextQuestion: function () {
    var next;
    this.questions().each(function(question) {
      if (question.get('answered') === false) {
        next = question;
      }
    })
    return next;
  }
});
