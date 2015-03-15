Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.subviews = [];

    // this.collection = this.model.questions();
    this.question = this.model.question();
    this.region = new Chickadee.Models.Region(this.model.get('region'));

    this.listenTo(this.model, "complete", this.goToResults)
  },

  events: {
    "click .answer":"handleAnswer"
  },

  template: JST["quiz_show"],

  handleAnswer: function (event) {
    var id = $(event.currentTarget).data('id');
    if (this.question.get('correct_answer').id === id) {
      var correct = true
    } else {
      var correct = false
    }

    this.question.save({correct: correct}, {
      success: function (model, response) {
        this.model.set(this.model.parse(response));
        this.question = this.model.question();
        this.render();
      }.bind(this)
    });
  },


  render: function () {
    var content = this.template({
      quiz: this.model,
      region: this.region,
      question: this.question,
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
