Chickadee.Views.RegionsIndexItem = Backbone.View.extend({
  initialize: function (options) {},

  template: JST["regions_index_item"],

  tagName: "li",

  className: "region-item",

  render: function () {
    var content = this.template({region: this.model});
    this.$el.html(content);
    var region_id = this.model.get('region_id');
    this.$el.data("region_id", parseInt(region_id));
    this.$el.data("map_url", this.model.get('map_url'));
    this.$el.data("name", this.model.name());
    return this;
  },
})
