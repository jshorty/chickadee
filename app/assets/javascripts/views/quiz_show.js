Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.subviews = [];
    console.log("VIEW IS HERE");
    this.question = this.model.question();
    this.region = new Chickadee.Models.Region(this.model.get('region'));
  },

  tagName: "section",
  className: "quiz-show",
  template: JST["quiz_show"],
  events: {
    "click .answer":"handleAnswer",
    "click .quiz-again":function(){
      Backbone.history.loadUrl();
    },
  },

  flashCorrect: function () {
    var flash = JST["answer_correct"]({bird: this.question.get('correct_answer')});
    var flashbox = this.$el.find(".flash-box");
    flashbox.addClass("correct");
    flashbox.html(flash);
    flashbox.hide();
    flashbox.fadeToggle("fast")
    setTimeout(function () {flashbox.fadeToggle("slow", "linear")}, 1500)
  },

  flashIncorrect: function () {
    var flash = JST["answer_incorrect"]({bird: this.question.get('correct_answer')});
    var flashbox = this.$el.find(".flash-box");
    flashbox.addClass("incorrect");
    flashbox.html(flash);
    flashbox.hide();
    flashbox.fadeToggle("fast")
    setTimeout(function () {flashbox.fadeToggle("slow", "linear")}, 1500)
  },

  handleAnswer: function (event) {
    var chosenId = $(event.currentTarget).data('id');
    var correctId = this.question.get('correct_answer').id;
    var correct = (correctId === chosenId ? true : false);

    correct ? this.flashCorrect() : this.flashIncorrect()

    this.question.save({correct: correct}, {
      success: function (model, response) {
        this.model.set(this.model.parse(response));
        if (parseInt(response.progress) < 10) {
          this.question = this.model.question();
          this.render();
        } else {
          this.results();
        }
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

  results: function () {
    var content = JST['quiz_results']({
      quiz: this.model,
      region: this.region
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
