Chickadee.Views.Loading = Backbone.View.extend({
  initialize: function (options) {
    if (options && options.message) {
      this.message = options.message;
    } else {
      this.message = "Loading...";
    }
  },

  template: JST["loading"],
  tagName: "section",
  className: "loading",

  render: function () {
    this.$el.html(this.template({message: this.message}));
    this.$el.find(".spinner").hide();
    setTimeout(function() {
      this.$el.find(".spinner").fadeIn(1000);
    }.bind(this), 200);
    return this;
  }
})
