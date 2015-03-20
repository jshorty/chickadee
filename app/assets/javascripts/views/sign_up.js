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
    debugger
    var view = this;
    $.ajax({
      url: "/api/users",
      method: 'POST',
      data: data,
      success: function(newUserData) {
        Chickadee.Models.currentUser;
        Chickadee.Models.currentUser.login(data);
        view.remove();
      },
      error: function (model, response) {
        var errors = response.responseJSON;
        view.$el.append(JST["errors"]({errors: errors}))
      }
    });
  },

  backToRoot: function (event) {
    console.log("Clicked!");
    this.$el.fadeOut(300, function () {
      Backbone.history.navigate("refresh");
    });
  }
});
