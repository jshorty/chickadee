Chickadee.Views.RegionShow = Backbone.View.extend({
  initialize: function (options) {
    if (!options.model) {
      // this.model =
    }
    this.subviews = [];
    this.listenTo(this.model, "sync", this.render)
  },

  template: JST["region_show"],

  events: {
    "click .region-button":"swapBirdIndex"
  },

  render: function () {
    this.removeSubviews();

    var content = this.template({region: this.model, regions: this.collection});
    this.$el.html(content);

    var birdIndex = new Chickadee.Views.BirdIndex({
      collection: this.model.birds()
    });
    this.subviews.push(birdIndex);
    this.$el.find(".bird-list").html(birdIndex.render().el);

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

  swapBirdIndex: function (event) {
    this.removeSubviews();

  }
})
