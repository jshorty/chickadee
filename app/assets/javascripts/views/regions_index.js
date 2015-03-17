Chickadee.Views.RegionsIndex = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.listenTo(this.collection, "add remove sync", this.render)
  },

  template: JST["regions_index"],

  events: {
    "click .new-region-link":"newRegion",
  },

  newRegion: function (event) {
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("regions/new", {trigger:true});
    });
  },

  render: function () {
    var content = this.template({regions: this.collection});
    this.$el.html(content);

    this.collection.each(function (region) {
      var subview = new Chickadee.Views.RegionsIndexItem({model: region});
      this.subviews.push(subview);
      this.$el.find(".region-menu").prepend(subview.render().el);
    }, this);

    if (this.collection.models.length === 0) {
      this.$el.find(".region-item").addClass("solo-centered");
    }

    return this;
  },

  remove: function () {
    var view = this;
    Backbone.View.prototype.remove.call(view);
    view.subviews.forEach(function (subview) {
      subview.remove();
    });
    view.subviews = [];
  }
})
