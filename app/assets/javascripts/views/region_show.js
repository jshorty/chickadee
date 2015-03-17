Chickadee.Views.RegionShow = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];

    if (!options.model) {
      this.showAllUserBirds();
    }

    this.$el.addClass("group");

    this.listenTo(this.model.birds(), "sync", this.render);
    this.listenTo(this.model, "sync", this.render);
  },

  template: JST["region_show"],

  className: "region-show",

  events: {
    "click .region-button":"swapBirdIndex",
    "click .region-update":"reloadRegionBirds",
    "click .quiz-start":"goToQuiz"
  },

  render: function () {
    this.removeSubviews();

    var content = this.template({region: this.model,
                                 regions: this.collection});
    this.$el.html(content);

    var birdIndex = new Chickadee.Views.BirdIndex({
      collection: this.model.birds()
    });
    this.subviews.push(birdIndex);
    this.$el.find(".bird-list").append(birdIndex.render().el);

    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });
    this.subviews = [];
  },

  showAllUserBirds: function () {
    this.model = new Chickadee.Models.Region()
    this.model.name = function () {
      return "All Birds";
    }

    var birds = new Chickadee.Collections.Birds({world: true})
    birds.fetch();
    this.model.birds = function () {
      return birds;
    };
  },

  swapBirdIndex: function (event) {
    var view = this;
    var id = $(event.currentTarget).data("id");
    var url = "regions/" + id + "/birds";
    view.$el.find(".bird-list li").fadeOut(300);
    view.$el.find(".region-header").fadeOut(300, function () {
      Backbone.history.navigate(url, { trigger: true });
    });
  },

  reloadRegionBirds: function (event) {
    this.model.fetch({data: {requery: true}});
  },

  goToQuiz: function (event) {
    var region_id = $(event.currentTarget).data("id");
    Backbone.history.navigate("#quiz/" + region_id, {trigger: true})
  }
})
