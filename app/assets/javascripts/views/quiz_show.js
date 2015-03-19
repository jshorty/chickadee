Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
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

    var view = this;
    flashbox.html(flash).hide().fadeToggle(400, function () {
      setTimeout(function () {
        flashbox.fadeToggle(600, "linear", function () {
          view.flashOver = true;
        });
      }, 1000)
    });
  },

  fadeToLoad: function () {
    var message = "Loading bird audio..."
    this.$el.find(".fade-box").fadeOut(500, function () {
      this.$el.find(".audio-box").html(JST["loading"]({message: message}));
      this.$el.find(".spinner").attr("src", "../spinner-dark.gif");
    }.bind(this));
  },

  handleAnswer: function (event) {
    if (this.answered) {return}
    this.answered = true
    this.flashOver = false;

    var chosenId = $(event.currentTarget).data('id');
    var correctId = this.question.get('correct_answer').id;
    var correct = (correctId === chosenId ? true : false);

    this.flashResult(correct);

    this.fadeToLoad();

    this.question.save({correct: correct}, {
      success: function (model, response) {
        console.log("LOADED");
        this.interval = window.setInterval(function () {
          // console.log("CHECKING INTERVAL!");
          // console.log(this.flashOver);
          if (this.flashOver) {
            console.log("FIRED!");
            this.nextQuestion(response);
            window.clearInterval(this.interval);
          }
        }.bind(this), 100);
      }.bind(this)
    });
  },

  nextQuestion: function (response) {
    this.model.set(this.model.parse(response));

    if (parseInt(response.progress) < 10) {
      this.question = this.model.question();
      this.answered = false;
      this.render();
    } else {
      this.answered = false;
      this.results();
    }
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
})
