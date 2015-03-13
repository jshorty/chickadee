Chickadee.Models.User = Backbone.Model.extend({
  url: "api/session",

  initialize: function () {
    this.listenTo(this, "change", this.checkLoggedIn)
  },

  isLoggedIn: function () {
    return !this.isNew();
  },

  login: function (credentials, success) {
    this.set(credentials);
    this.save({}, {
      success: success,
      error: function () {
        console.log("Error logging in.");
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
    if (this.isNew()) {
      this.trigger("login");
    } else {
      this.trigger("logout");
    }
  }
});

Chickadee.Models.currentUser = new Chickadee.Models.User();
