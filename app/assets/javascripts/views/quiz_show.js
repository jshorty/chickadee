Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.subviews = [];
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

  flashResult: function (correct, callback) {
    var resultStr = correct ? "correct" : "incorrect"
    var flash = JST[("answer_" + resultStr)]({bird: this.question.get('correct_answer')});
    var flashbox = this.$el.find(".flash-box");
    flashbox.addClass(resultStr);
    flashbox.html(flash);
    flashbox.hide();
    flashbox.fadeToggle("fast")
    setTimeout(function () {
      flashbox.fadeToggle("slow", "linear", function (){
        return callback();
      });
    }, 1500)
  },

  fadeToLoad: function () {
    var view = this;
    view.$el.find(".audio-box").children().fadeOut(500, function () {
      view.$el.find(".audio-box").html(
        JST["loading"]({message: "Loading bird audio..."})
      );
    });
  },

  handleAnswer: function (event) {
    var chosenId = $(event.currentTarget).data('id');
    var correctId = this.question.get('correct_answer').id;
    var correct = (correctId === chosenId ? true : false);

    var flashFn = (correct ? this.flashCorrect : this.flashIncorrect)
    this.flashResult(correct, this.fadeToLoad.bind(this));

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
