Chickadee.Views.RegionForm = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = []
  },

  tagName: "form",

  events: {
    "submit":"submitNewRegion"
  },

  template: JST["region_form"],

  render: function () {
    this.removeSubviews()
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },

  submitNewRegion: function (event) {
    event.preventDefault();
    var attr = $(event.currentTarget).serializeJSON();
    var view = this;

    this.model.save(attr, {
      success: function () {
        Chickadee.Collections.regions.add(this.model)
        Backbone.history.navigate("regions", {trigger: true})
      },
      error: function (model, response) {
        view.displayErrors(response.responseJSON);
      }
    });
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
  }
})
