Chickadee.Views.BirdShow = Backbone.View.extend({

  template: JST["bird_show"],
  className: "bird-show",

  events: {
    "click .summary":"goToWikipedia"
  },

  goToWikipedia: function() {
    if (this.model.wikipedia_link) {
      window.location.href = this.model.wikipedia_link;
    }
  },

  render: function () {
    var content = this.template({bird: this.model});
    this.$el.html(content);
    return this;
  },
})
