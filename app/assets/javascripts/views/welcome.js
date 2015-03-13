Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];
    this.listenTo(this.model, "sync", this.checkLoggedIn)
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
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
  },

  openSignUpWindow: function (event) {
    var subview = new Chickadee.Views.SignUp();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  },

  checkLoggedIn: function (event) {
    if (this.model.get('logged_in') === true) {
      Backbone.history.navigate("#regions", {trigger: true});
    }
  }
});
