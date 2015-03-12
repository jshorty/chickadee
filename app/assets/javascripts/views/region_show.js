Chickadee.Views.RegionShow = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];

    if (!options.model) {
      this.showAllUserBirds();
    }

    this.listenTo(this.model.birds(), "sync", this.render);
    this.listenTo(this.model, "sync", this.render);
  },

  template: JST["region_show"],

  events: {
    "click .region-button":"swapBirdIndex"
  },

  render: function () {
    this.removeSubviews();
    console.log(this.model.name());
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
    var id = $(event.currentTarget).data("id")
    if (id === 0) {
      // this.showAllUserBirds();
      Backbone.history.navigate("birds", { trigger: true })
    } else {
      var url = "regions/" + id + "/birds"
      // this.model = new Chickadee.Models.Region({id: id});
      // this.model.fetch();
      // this.render();
      Backbone.history.navigate(url, { trigger: true })
    }
  }
})
