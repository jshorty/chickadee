Chickadee.Views.UserProfile = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];
    this.listenTo(this.model, "sync", this.render)
  },

  events: {
    "click .edit-user-profile":"renderForm",
    "change #user-image-input":"changeImage",
    "submit form":"updateProfile"
  },

  template: JST["user_show"],

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
    this.removeSubviews();
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
  },

  renderForm: function (event) {
    this.removeSubviews();
    var content = JST["user_edit"]({user: this.model})
    this.$el.html(content);
    return this;
  },

  displayErrors: function (errors) {
    this.removeSubviews();
    var subview = new Chickadee.Views.Errors({errors: errors});
    this.subviews.push(subview)
    this.$el.append(subview.render().el)
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });
    this.subviews = [];
  }
})
