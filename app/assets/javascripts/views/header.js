Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];

    this.model = Chickadee.Models.session;

    this.listenTo(this.model, "change sync", this.render);
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
    Backbone.history.navigate(
      "profile/" + this.model.get('user').id, {trigger: true}
    );
  },

  checkLoggedIn: function () {
    if (this.model.get('logged_in') === true) {
      var userData = this.model.get('user')
      var user = new Chickadee.Models.User(userData);
      return JST["header_private"]({user: user});
    } else {
      return JST["header_public"]();
    }
  },

  login: function (event) {
    event.preventDefault();
    var credentials = $(event.currentTarget).serializeJSON();
    this.model.login(
      credentials,
      function () {
        this.render();
        Backbone.history.navigate("regions", {trigger: true});
      }.bind(this)
    );
  },

  logout: function (event) {
    event.preventDefault();
    this.model.logout();
  }
});
