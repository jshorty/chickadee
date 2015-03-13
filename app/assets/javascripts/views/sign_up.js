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
    var user = new Chickadee.Models.User(data);
    var view = this;
    user.save({}, {
      success: function () {
        view.remove();
        Backbone.history.navigate("", { trigger: true });
      },
      error: function (model, response) {
        var errors = response.responseJSON;
        view.$el.append(JST["errors"]({errors: errors}))
      }
    });
  }
});
