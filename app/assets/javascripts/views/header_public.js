Chickadee.Views.HeaderPublic = Backbone.View.extend({
  initialize: function () {
    this.subviews = []
  },

  tagName: "header",

  template: JST["header_public"],

  events: {
    "click .login":"openLoginWindow"
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.protoype.remove.call(this)
  },

  openLoginWindow: function (event) {
    var subview = new Chickadee.Views.Login();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  }
});
