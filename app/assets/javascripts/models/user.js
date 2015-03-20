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
  },

  isLoggedIn: function () {
    return !this.isNew();
  },

  login: function (credentials) {
    this.set(credentials);
    this.save({}, {
      success: function () {
        Backbone.history.navigate("regions", {trigger:true})
        return true
      },
      error: function () {
        console.log("Error logging in.");
        return false
      },
    });
  },

  logout: function (callback) {
    var currentUser = this;
    $.ajax({
      url: "/api/session",
      method: 'DELETE',
      success: function() {
        currentUser.clear();
        Backbone.history.navigate("", { trigger: true });
      }
    });
  },

  checkLoggedIn: function () {
    if (!this.isNew()) {
      this.trigger("login");
    } else {
      this.trigger("logout");
    }
  }
});
