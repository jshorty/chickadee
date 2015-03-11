Chickadee.Views.Errors = Backbone.View.extend({
  initialize: function (options) {
    this.errors = options.errors
  },

  template: JST["errors"],

  render: function () {
    var content = this.template({errors: this.errors})
    this.$el.html(content);
    return this;
  }
})
