Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];

    this.model = Chickadee.Models.currentUser;

    this.listenTo(this.model, "login logout sync", this.render);
  },

  template: JST["header_public"],

  events: {
    "click .login":"openLoginWindow",
    "click .logout":"logout",
    "submit form":"login",
    "click .profile":"openMyProfile"
  },

  render: function (options) {
    var content = this.checkLoggedIn();
    this.$el.html(content);
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
  },

  openLoginWindow: function (event) {
    var subview = new Chickadee.Views.Login();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  },

  openMyProfile: function (event) {
    event.preventDefault();
    Backbone.history.navigate("profile", {trigger: true});
  },

  checkLoggedIn: function () {
    if (this.model.isLoggedIn()) {
      return JST["header_private"]({user: this.model});
    } else {
      return JST["header_public"]();
    }
  },

  login: function (event) {
    event.preventDefault();
    var credentials = $(event.currentTarget).serializeJSON();
    this.model.login(credentials);
  },

  logout: function (event) {
    event.preventDefault();
    this.model.logout();
  }
});
