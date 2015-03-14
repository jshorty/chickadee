Chickadee.Views.BirdIndex = Backbone.View.extend({
  template: JST["bird_index"],

  tagName: "ul",

  render: function () {
    var content = this.template({birds: this.collection});
    this.$el.html(content);
    return this;
  },
})
