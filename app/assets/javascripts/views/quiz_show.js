Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.subviews = [];

    this.collection = this.model.questions()

    this.listenTo(this.model, "complete", this.goToResults)
    this.listenTo(this.model, "complete", this.goToResults)
  },

  events: {

  },

  template: JST["quiz_show"],

  render: function () {
    var content = this.template({question: this.model.nextQuestion()});
    this.$el.html(content);
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  goToResults: function () {

  },
})
