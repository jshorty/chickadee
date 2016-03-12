Chickadee.Views.SignUp = Backbone.View.extend({

  template: JST["sign_up"],

  events: {
    "click .get-started-button":"submit"
  },

  tagName: "section",
  className: "modal-backdrop modal-backdrop-orange",

  render: function () {
    this.$el.html(this.template());
    this.$el.find(".login-error").hide();
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var data = this.$("form").serializeJSON();
    if (this.passwordsMatch(data)) {
      var view = this;
      $.ajax({
        url: "/api/users",
        method: 'POST',
        data: data,
        success: function(newUserData) {
          Chickadee.Models.currentUser.firstTime = true;
          Chickadee.Models.currentUser.login(data);
          view.remove();
        },
        error: function (response) {
          var errors = response.responseJSON;
          this.$(".login-error").empty();
          this.$(".login-error").append(errors[0] + ".");
          this.displayError();
        }.bind(this)
      });
    } else {
      this.$(".login-error").empty();
      this.$(".login-error").append("Passwords do not match.");
      this.displayError();
    }
  },

  passwordsMatch: function (data) {
    return data["user"]["password"] === data["user"]["confirm_password"];
  },

  displayError: function () {
    this.$(".login-error").fadeIn(300, function () {
      setTimeout(function () {
        this.$(".login-error").fadeOut(300);
      }.bind(this), 3000)
    }.bind(this));
  }
});
