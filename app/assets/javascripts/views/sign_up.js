Chickadee.Views.SignUp = Backbone.View.extend({

  template: JST["sign_up"],

  events: {
    "submit form":"submit"
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();
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
  }
});
