Chickadee.Views.UserProfile = Backbone.View.extend({
  initialize: function () {
    this.subviews = []
  },

  events: {
    "click .edit-user-profile":"renderForm",
    "click .update-user-profile":"updateProfile"
  },

  template: JST["user_profile"],

  render: function () {
    this.removeSubviews();
    var content = this.template({user: this.model});
    this.$el.html(content);
    return this;
  },

  updateProfile: function (event) {
    event.preventDefault();
    var view = this;
    var data = $(this.$el.find("form")).serializeJSON();
    this.model.save(data, {
      success: function () {
        view.render();
      },
      error: function (model, response) {
        view.displayErrors(response.responseJSON);
      }
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
