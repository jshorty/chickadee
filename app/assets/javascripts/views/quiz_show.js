Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.subviews = [];

    this.collection = this.model.questions()
    this.region = new Chickadee.Models.Region(this.model.get('region'))

    this.listenTo(this.model, "complete", this.goToResults)
    this.listenTo(this.model, "complete", this.goToResults)
  },

  events: {

  },

  template: JST["quiz_show"],

  render: function () {
    var question = this.model.nextQuestion();
    var answers = question.answerChoices();
    debugger
    var content = this.template({
      quiz: this.model,
      region: this.region,
      question: question,
    });
    this.$el.html(content);
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  goToResults: function () {

  },
})
