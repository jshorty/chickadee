Chickadee.Views.Login = Backbone.View.extend({

  template: JST["login"],
  tagName: "form",

  render: function () {
    this.$el.html(this.template());
    this.$el.find(".login-error").hide();
    return this;
  },
});
