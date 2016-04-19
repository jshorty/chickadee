Chickadee.Views.NoQuiz = Backbone.View.extend({
  events: {
    'click .back-button':'backToHome'
  },
  template: JST["no_quiz"],

  backToHome: function() {
    this.$el.fadeOut(200, function() {
      Backbone.history.navigate("#regions", {trigger: true});
    });
  },

  render: function() {
      this.$el.html(this.template());
      return this;
  }
})
