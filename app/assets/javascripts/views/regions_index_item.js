Chickadee.Views.RegionsIndexItem = Backbone.View.extend({
  initialize: function (options) {},

  template: JST["regions_index_item"],

  tagName: "li",

  className: "region-item",

  render: function () {
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },
})
