Chickadee.Models.Quiz = Backbone.Model.extend({
  urlRoot: "/api/quizzes",

  question: function(){
    if (!this._question) {
      this._question = new Chickadee.Models.Question();
    }
    return this._question;
  },

  parse: function(payload){
    if (payload.question) {
      this.question().set(payload.question);
      delete payload.question;
    }
    return payload;
  },
});
