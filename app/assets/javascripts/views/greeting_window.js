Chickadee.Views.GreetingWindow = Backbone.View.extend({

  template: JST["greeting_window"],
  tagName: "section",
  className: "modal-backdrop modal-backdrop-blue",

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
