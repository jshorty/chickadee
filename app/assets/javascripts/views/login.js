Chickadee.Views.Login = Backbone.View.extend({

  template: JST["login"],
  tagName: "section",
  className: "modal-backdrop",

  render: function () {
    this.$el.html(this.template());
    this.$el.find(".login-error").hide();
    return this;
  }
});
