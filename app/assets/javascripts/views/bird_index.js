Chickadee.Views.BirdIndex = Backbone.View.extend({
  initialize: function () {},

  template: JST["bird_index"],

  events: {
    "click .quiz-start":"createQuiz"
  },

  tagName: "ul",

  render: function () {
    var content = this.template({birds: this.collection});
    this.$el.html(content);
    return this;
  },

  createQuiz: function () {
  }
})
