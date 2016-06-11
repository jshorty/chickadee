Chickadee.Views.QuizShow = Backbone.View.extend({
  initialize: function (options) {
    this.regionId = options.regionId;
    this.question = this.model.question();
    this.eagerLoadImage();
    this.region = new Chickadee.Models.Region(this.model.get('region'));
  },

  tagName: "section",
  className: "quiz-show group",
  template: JST["quiz_show"],
  events: {
    "click .answer":"handleAnswer",
    "click .quiz-again":"quizAgain",
    "click .back-button":"goToIndex",
  },

  fadeToAnswerThenLoading: function(correct) {
    this.$(".fade-box").fadeOut(300, function() {
      this.$(".audio-box").html(JST["bird_answer"]({question: this.question, correct: correct}));
      this.$(".answer-box").fadeIn(300, function() {
        setTimeout(function() {
          this.$(".answer-box").fadeOut(500, function() {
            this.flashOver = true;
            this.$(".audio-box").html(JST["loading"]({message: "Loading audio..."}));
            this.$(".audio-box").prepend("<br><br><br>");
          }.bind(this));
        }.bind(this), 3000);
      }.bind(this));
    }.bind(this));
  },

  fillProgressBar: function () {
    this.model.get('history').forEach(function (answer, i) {
      var currentDot = (i + 1).toString();
      var $dot = this.$(".quiz-progress div:nth-last-child(" + currentDot + ")");
      $dot.removeClass();
      if (answer === "Y") {
        $dot.addClass("correct");
      } else if (answer === "N") {
        $dot.addClass("incorrect");
      } else {
        $dot.addClass("unanswered")
      }
    }.bind(this))
  },

  updateScore: function () {
    this.$(".quiz-score").html(parseInt(this.model.get('score')) + 1);
  },

  fadeOutSongAndPing: function(isCorrect) {
    this.$('audio')[0].animate({volume: 0.0}, 3000);
    audioSrc = isCorrect ? "correct.mp3" : "incorrect-beep.mp3";
    this.$('.ping').html(`<audio autoplay="true" src="${audioSrc}"></audio>`);
  },

  handleAnswer: function (event) {
    if (this.answered) {return}
    this.answered = true
    this.flashOver = false;

    var chosenId = $(event.currentTarget).data('id');
    var correctId = this.question.get('correct_answer').id;
    var correct = (correctId === chosenId ? true : false);

    this.fadeOutSongAndPing(correct);

    this.fillProgressBar();
    correct && this.updateScore();

    this.fadeToAnswerThenLoading(correct);

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
      this.eagerLoadImage();
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
    this.fillProgressBar();
    return this;
  },

  results: function () {
    var content = JST['quiz_results']({
      quiz: this.model,
      region: this.region
    });

    this.$el.html(content);
    this.renderGraph();
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
  },

  eagerLoadImage: function() {
    var birdPhoto = new Image(313, 200);
    birdPhoto.src = this.question.get('image_url');
  },

  renderGraph: function () {
    var data = this.model.get('xp_timeseries');
    // timeseries.forEach(function(xpPoints) {
    //   data.push({xp: parseInt(xpPoints)})
    // });
    var margin = {top: 30, right: 20, bottom: 30, left: 120},
        width = 500 - margin.left - margin.right,
        height = 220 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]).domain([0, 6])

    var y = d3.scale.linear().range([height, 0])
              .domain([d3.min(data) - 20, d3.max(data)]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom")
                  .ticks(6).tickSize(-5, 0).tickFormat('');
    var yAxis = d3.svg.axis().scale(y).orient("left")
                  .ticks(3).tickSize(-5, 0);

    var valueline = d3.svg.line()
                      .x(function(d, i) { return x(i); })
                      .y(function(d) { return y(d); })

    var svg = d3.select("#xp-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                  "translate(" + (margin.left - 50) + "," + margin.top + ")");

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".tick")
       .filter(function (d) { return d === 0;  })
       .remove();

  }
})
