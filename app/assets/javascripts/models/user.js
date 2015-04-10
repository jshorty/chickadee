Chickadee.Models.User = Backbone.Model.extend({
  urlRoot: "api/users",

  name: function () {
    if (this.get('alias')) {
      return this.get('alias');
    } else if (this.get('email')) {
      return this.get('email');
    } else {
      return "anonymous user";
    }
  },
});

Chickadee.Models.CurrentUser = Chickadee.Models.User.extend({
  url: "/api/session",

  initialize: function () {
    this.listenTo(this, "change", this.checkLoggedIn)
    this.firstTime = false;
  },

  isLoggedIn: function () {
    return !this.isNew();
  },

  login: function (credentials) {
    this.set(credentials);
    this.save({}, {
      success: function () {
        Backbone.history.navigate("regions", {trigger:true})
        this.trigger("loginSuccess")
      }.bind(this),
      error: function () {
        this.trigger("loginFail")
      }.bind(this)
    });
  },

  logout: function (callback) {
    var currentUser = this;
    $.ajax({
      url: "/api/session",
      method: 'DELETE',
      success: function() {
        currentUser.clear();
        this.trigger("logout");
        Backbone.history.navigate("", { trigger: true });
      }.bind(this)
    });
  },

  checkLoggedIn: function () {
    if (!this.isNew()) {
      this.trigger("login");
    } else {
      this.isLoggedIn() && this.trigger("logout");
    }
  }
});
