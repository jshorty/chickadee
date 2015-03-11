Chickadee.Views.RegionsIndex = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.listenTo(this.collection, "add remove sync", this.render)
  },

  template: JST["regions_index"],

  render: function () {
    var content = this.template({regions: this.collection});
    this.$el.html(content);

    this.collection.each(function (region) {
      var subview = new Chickadee.Views.RegionsIndexItem({model: region});
      this.subviews.push(subview);
      this.$el.append(subview.render().el);
    }, this);

    return this;
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);

    this.subviews.forEach(function (subview) {
      subview.remove();
    });
  }
})
