Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    this.model = Chickadee.Models.currentUser;

    this.listenTo(this.model, "login logout sync", this.render);
    this.listenTo(this.model, "loginFail", this.displayError);
    this.listenTo(this.model, "loginSuccess", this.handleLogin);
  },

  tagName: "header",
  className: "group",

  template: JST["header_public"],

  events: {
    "click .about":"goToAbout",
    "click .login":"openLoginWindow",
    "click .modal-backdrop":"closeLoginWindow",
    "click .logout":"logout",
    "submit form":"login",
    "click .profile":"openMyProfile",
    "click .home-link":"goToHome",
    "click .logo":"goToHome",
    "click .birds-link":"goToBirds",
    "click #nav-toggle":"toggleNav"
  },

  render: function (options) {
    var content = this.checkLoggedIn();
    this.$el.html(content);
    this.$(".welcome-popdown").hide();

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
    if (this.dropdown) {
      this.toggleNav();
    }

    if (!this.openedLogin) {
      this.openedLogin = true;
      this.loginWindow = new Chickadee.Views.Login();
      this.$el.append(this.loginWindow.render().el);
      this.loginWindow.$el.fadeIn(300);
    }
  },

  closeLoginWindow: function (event) {
    if (event.target === event.currentTarget) {
      this.loginWindow.$el.fadeOut(300, function () {
        this.loginWindow.remove();
      }.bind(this));
      this.openedLogin = false;
    }
  },

  openMyProfile: function (event) {
    event.preventDefault();
    Backbone.history.navigate("profile", {trigger: true});
  },

  goToAbout: function(event) {
    if (this.dropdown) {
      this.toggleNav();
    }
    event.preventDefault();
    Backbone.history.navigate("about", {trigger: true});
  },

  goToHome: function (event) {
    if (event) {
      event.preventDefault();
    }
    if (this.dropdown) {
      this.toggleNav();
    }
    this.$(".home-link").parent().addClass("current");
    this.$(".birds-link").parent().removeClass("current");
    Backbone.history.navigate("regions", {trigger: true});
  },

  goToBirds: function (event) {
    event.preventDefault();
    this.$(".birds-link").parent().addClass("current");
    this.$(".home-link").parent().removeClass("current");
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
    this.$(".login-error").hide();
    var credentials = $(event.currentTarget).serializeJSON();
    this.model.login(credentials);
  },

  handleLogin: function (event) {
    this.loggingIn = true;
    this.openedLogin = false;
    this.render();
  },

  logout: function (event) {
    event.preventDefault();
    this.model.logout();
  },

  welcomePopdown: function () {
    var view = this;
    if (!this.model.firstTime) {
      var popdown = view.$(".welcome-popdown")
      popdown.fadeIn(500, function () {
        setTimeout(function () {popdown.fadeOut('5000')}, 2000);
      });
    }
    view.loggingIn = false;
  },

  displayError: function () {
    this.$(".login-error").fadeIn(300, function () {
      setTimeout(function () {
        this.$(".login-error").fadeOut(300);
      }.bind(this), 3000)
    }.bind(this));
  },

  toggleNav: function(event) {
    if (event) {
      event.preventDefault();
    }
    var nav = event ? $(event.currentTarget) : $('#nav-toggle');
    if (nav.hasClass('active')) {
      nav.removeClass('active');
      this.hideDropdown();
    } else {
      nav.addClass('active');
      this.showDropdown();
    }
  },

  showDropdown: function() {
    this.dropdown = new Chickadee.Views.Modal({
      header: 'chickadee',
      useButtons: true,
      buttons: [{text: 'LOGIN', class: 'login'}, {text: 'ABOUT', class: 'about'}, {text: 'HOME', class: 'home-link'}]
    });
    $(".dropdown").append(this.dropdown.render().el);
    this.dropdown.$el.fadeIn(300);
    $("#nav-toggle").css({'z-index': '10', 'right': '0px', 'position': 'fixed'});
  },

  hideDropdown: function() {
    this.dropdown.$el.fadeOut(300, function() {
      this.dropdown.remove();
      this.dropdown = undefined;
    }.bind(this));
  }
});
