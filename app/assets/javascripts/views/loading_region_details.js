Chickadee.Views.LoadingRegionDetails = Backbone.View.extend({
  template: JST['loading_region_details'],
  className: 'region-details',

  render: function() {
    this.$el.html(this.template());
    return this;
  },
});
