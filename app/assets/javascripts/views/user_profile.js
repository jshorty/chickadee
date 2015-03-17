Chickadee.Views.UserProfile = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.model, "sync", this.render)
    this.$el.attr("enctype", "multipart/form-data")
  },

  events: {
    "click .back-button":"goToRegions",
    "change #user-image-input":"changeImage",
    "submit form":"updateProfile"
  },

  template: JST["user_edit"],

  tagName: "form",
  className: "edit-profile",

  goToRegions: function (event) {
    event && event.preventDefault();
    this.$el.fadeOut(300, function () {
      Backbone.history.navigate("regions", {trigger: true})
    });
  },

  changeImage: function (event) {
    event.preventDefault();
    var file = event.currentTarget.files[0];

    var fileReader = new FileReader();
    var view = this;

    fileReader.onloadend = function () {
      view.model.set("image", fileReader.result);
      view.model.set("new_image", true);
      view.$(".user-image").attr("src", fileReader.result)
    };

    fileReader.readAsDataURL(file);
  },

  render: function () {
    var content = this.template({user: this.model});
    this.$el.html(content);
    return this;
  },

  updateProfile: function (event) {
    event.preventDefault();
    var view = this;
    var data = $(view.$el.find("form")).serializeJSON();

    if (view.model.get('new_image')) {
      data.user.image = view.model.get('image')
    }

    $.ajax({
      method: "PATCH",
      url: "/api/users/" + this.model.id,
      data: data,
      success: function () {
        view.model.fetch();
        view.render();
      },
      error: function (model, response) {
        view.displayErrors(response.responseJSON);
      },
    });
  }
});
