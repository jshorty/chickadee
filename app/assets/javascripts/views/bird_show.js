Chickadee.Views.BirdShow = Backbone.View.extend({

  template: JST["bird_show"],
  className: "bird-show",

  render: function () {
    var content = this.template({bird: this.model});
    this.$el.html(content);
    return this;
  },
})
