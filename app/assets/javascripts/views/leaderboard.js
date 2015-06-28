Chickadee.Views.Leaderboard = Backbone.View.extend({

  template: JST["leaderboard"],
  tagName: "section",
  className: "leaderboard-main",

  initialize: function (options) {
    this.currentBoardIndex = Math.floor(Math.random() * this.collection.models.length);
  },

  render: function () {
    var board = this.createBoard();
    this.$el.html(this.template({board: board}));
    this.$(".leaderboard-rotator").fadeIn(500, function () {
      setTimeout(function () {this.switchBoard();}.bind(this), 4500);
    }.bind(this));
    return this;
  },

  createBoard: function () {
    var region = this.collection.models[this.currentBoardIndex];
    console.log(this.currentBoardIndex);
    var users = region.get('leaderboard');
    return {name: region.name(), users: region.get('leaderboard')}
  },

  switchBoard: function () {
    this.$(".leaderboard-rotator").fadeOut(700, function () {
      if (this.currentBoardIndex === this.collection.models.length - 1) {
        this.currentBoardIndex = 0;
      } else {
        this.currentBoardIndex += 1;
      }
      var board = this.createBoard();
      this.$el.html(this.template({board: board}));
      this.$(".leaderboard-rotator").fadeIn(700, function () {
        setTimeout(function () {this.switchBoard();}.bind(this), 4500);
      }.bind(this));
    }.bind(this));
  }
});
