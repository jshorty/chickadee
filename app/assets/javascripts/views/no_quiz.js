Chickadee.Views.NoQuiz = Backbone.View.extend({

  template: JST["no_quiz"],

  render: function () {
      this.$el.html(this.template());
      return this;
  }

})
