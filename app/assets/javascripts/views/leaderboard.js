Chickadee.Views.Leaderboard = Backbone.View.extend({

  template: JST["leaderboard"],
  tagName: "section",
  className: "leaderboard-main",

  initialize: function (options) {
    this.currentBoardIndex = 0;
  },

  render: function () {
    var board = this.createBoard();
    this.$el.html(this.template({board: board}));
    setTimeout(function () {this.switchBoard();}.bind(this), 7000);
    return this;
  },

  createBoard: function () {
    var region = this.collection.models[this.currentBoardIndex];
    var users = region.get('leaderboard');
    return {name: region.name(), users: region.get('leaderboard')}
  },

  switchBoard: function () {
    if (this.currentBoardIndex === this.collection.models.length - 1) {
      this.currentBoardIndex = 0;
    } else {
      this.currentBoardIndex += 1;
    }

    this.render();
  }
});
