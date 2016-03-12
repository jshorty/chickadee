Chickadee.Views.About = Backbone.View.extend({
  template: JST["about"],

  render: function () {
    var content = this.template();
    this.$el.html(content);
    return this;
  },
})
