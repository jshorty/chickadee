Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];

    this.model = Chickadee.Models.currentUser;

    this.listenTo(this.model, "login logout sync", this.render);
  },

  tagName: "header",
  className: "group",

  template: JST["header_public"],

  events: {
    "click .login":"openLoginWindow",
    "click .logout":"logout",
    "submit form":"login",
    "click .profile":"openMyProfile",
    "click .home-link":"goToHome",
    "click .logo":"goToHome",
    "click .birds-link":"goToBirds"
  },

  render: function (options) {
    var content = this.checkLoggedIn();
    this.$el.html(content);
    this.$el.find(".welcome-popdown").hide();

    if (this.loggingIn) {
      setTimeout(function () {
        this.welcomePopdown();
      }.bind(this), 500);
    }

    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
  },

  openLoginWindow: function (event) {
    if (!this.openedLogin) {
      this.openedLogin = true;
      var subview = new Chickadee.Views.Login();
      this.subviews.push(subview);
      this.$el.append(subview.render().el);
      subview.$el.fadeIn(300);
    }
  },

  openMyProfile: function (event) {
    event.preventDefault();
    Backbone.history.navigate("profile", {trigger: true});
  },

  goToHome: function (event) {
    event.preventDefault();
    this.$el.find(".home-link").parent().addClass("current");
    this.$el.find(".birds-link").parent().removeClass("current");
    Backbone.history.navigate("regions", {trigger: true})
  },

  goToBirds: function (event) {
    event.preventDefault();
    this.$el.find(".birds-link").parent().addClass("current");
    this.$el.find(".home-link").parent().removeClass("current");
    Backbone.history.navigate("birds", {trigger: true})
  },

  checkLoggedIn: function () {
    if (this.model.isLoggedIn()) {
      return JST["header_private"]({user: this.model});
      this.openedLogin = false;
    } else {
      return JST["header_public"]();
    }
  },

  login: function (event) {
    event.preventDefault();
    this.$el.find(".login-error").hide();
    var credentials = $(event.currentTarget).serializeJSON();
    if (this.model.login(credentials)) {
      this.loggingIn = true;
      this.openedLogin = false;
    } else {
      this.displayError();
    }
  },

  logout: function (event) {
    event.preventDefault();
    this.model.logout();
  },

  welcomePopdown: function () {
    var view = this;
    var popdown = view.$el.find(".welcome-popdown")
    popdown.fadeIn(500, function () {
      setTimeout(function () {popdown.fadeOut('5000')}, 2000);
    });
    view.loggingIn = false;
  },

  displayError: function () {
    this.$("form").find("p").fadeIn(300);
  }
});
