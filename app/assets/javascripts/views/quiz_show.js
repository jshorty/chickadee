Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.question = this.model.question();
    this.region = new Chickadee.Models.Region(this.model.get('region'));
    this.$el.append('<audio class="ping" src="correct-beep.mp3"></audio>')
    this.$el.append('<audio class="ping" src="incorrect-beep.mp3"></audio>')
  },

  tagName: "section",
  className: "quiz-show group",
  template: JST["quiz_show"],
  events: {
    "click .answer":"handleAnswer",
    "click .quiz-again":"quizAgain",
    "click .back-button":"goToIndex",
  },

  flashResult: function (correct, callback) {
    var resultStr = correct ? "correct" : "incorrect"
    var flash = JST[("answer_" + resultStr)]({bird: this.question.get('correct_answer')});
    var flashbox = this.$(".flash-box");
    flashbox.addClass(resultStr);
    this.$el.append('<audio class="ping" src="'+ resultStr +'-beep.mp3" autoplay></audio>');
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
    var message = "Loading audio..."
    this.$(".fade-box").fadeOut(500, function () {
      this.$(".audio-box").html(JST["loading"]({message: message}));
      this.$(".spinner").attr("src", "../spinner-dark.gif");
      this.$(".audio-box").prepend("<br><br><br>")
    }.bind(this));
  },

  updateProgressBar: function (correct) {
    var newClass = (correct ? "correct" : "incorrect")
    var currentDot = parseInt(this.model.get('progress')) + 1
    var $dot = this.$(".quiz-progress div:nth-last-child(" + currentDot + ")")
        $dot.removeClass("unanswered")
        $dot.addClass(newClass)
    this.oldProgressBar = this.$(".quiz-progress").html();
  },

  updateScore: function () {
    debugger;
    this.$(".quiz-score").html(parseInt(this.model.get('score')) + 1);
  },

  handleAnswer: function (event) {
    if (this.answered) {return}
    this.answered = true
    this.flashOver = false;

    var chosenId = $(event.currentTarget).data('id');
    var correctId = this.question.get('correct_answer').id;
    var correct = (correctId === chosenId ? true : false);

    this.updateProgressBar(correct);
    correct && this.updateScore();
    this.flashResult(correct);

    this.fadeToLoad();

    this.question.save({correct: correct}, {
      success: function (model, response) {
        this.interval = window.setInterval(function () {
          if (this.flashOver) {
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
    if (this.oldProgressBar) {
      this.$(".quiz-progress").html(this.oldProgressBar);
    }
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

  quizAgain: function (event) {
    this.$el.fadeOut(300, function () {
      Backbone.history.loadUrl();
    });
  },

  goToIndex: function (event) {
    this.$el.fadeOut(300, function () {
      Backbone.history.navigate("regions", {trigger: true})
    });
  }
})
