Chickadee.Views.SignUp = Backbone.View.extend({

  template: JST["sign_up"],

  events: {
    "click .back-button":"backToRoot",
    "click .go-button":"submit"
  },

  className: "modal-backdrop",

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var data = this.$("form").serializeJSON();
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
        if (errors[0] === "Email has already been taken") {
          errors[0] = "This email is in use";
        }
        this.$("#user_email").val(errors[0]);
      }.bind(this)
    });
  },

  backToRoot: function (event) {
    console.log("Clicked!");
    this.$el.fadeOut(300, function () {
      Backbone.history.navigate("refresh");
    });
  }
});
