Chickadee.Views.RegionShow = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.listenTo(this.model, "sync", this.render)
  },

  template: JST["region_show"],

  render: function () {
    console.log(this.model.get('country'));
    this.removeSubviews();

    var content = this.template({region: this.model});
    this.$el.html(content);

    var birdIndex = new Chickadee.Views.BirdIndex({collection: this.model.birds()});
    this.subviews.push(birdIndex);
    this.$el.append(birdIndex.render().el);

    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });
  }
})
