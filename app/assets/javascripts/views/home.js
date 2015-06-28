Chickadee.Views.Home = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.regions = options.regions;
  },

  className: "home",
  template: JST["home"],

  render: function () {
    this.$el.html(this.template());

    var regionsIndex = new Chickadee.Views.RegionsIndex({collection: this.regions});
    this.subviews.push(regionsIndex);
    var leaderboard = new Chickadee.Views.Leaderboard({collection: this.regions});
    this.subviews.push(leaderboard);

    this.$("#region-menu").html(regionsIndex.render().el)
    this.$("#leaderboard").html(leaderboard.render().el)
    return this;
  },

  remove: function () {
    var view = this;
    Backbone.View.prototype.remove.call(view);
    view.subviews.forEach(function (subview) {
      subview.remove();
    });
    view.subviews = [];
  },
});
