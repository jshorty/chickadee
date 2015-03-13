Chickadee.Views.NotFound = Backbone.View.extend({
  initialize: function () {},

  template: JST["not_found"],

  render: function () {
    var content = this.template();
    this.$el.html(content);
    return this;
  },
});
