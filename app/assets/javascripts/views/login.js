Chickadee.Views.Login = Backbone.View.extend({

  template: JST["login"],

  render: function () {
    this.$el.html(this.template());
    return this;
  },

});
