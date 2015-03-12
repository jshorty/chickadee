Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];
  },

  template: JST["welcome"],

  events: {
      "click .sign-up":"openSignUpWindow"
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.protoype.remove.call(this)
  },

  openSignUpWindow: function (event) {
    var subview = new Chickadee.Views.SignUp();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  }
});
