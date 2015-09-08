Chickadee.Views.BirdIndex = Backbone.View.extend({
  template: JST["bird_index"],

  tagName: "ul",

  events: {
    "click .bird-link":"birdSelected"
  },

  render: function () {
    var content = this.template({birds: this.collection});
    this.$el.html(content);
    return this;
  },

  birdSelected: function (event) {
    var birdId = $(event.currentTarget).data().id;
    this.trigger("birdSelected", {birdId: birdId});
  }
})
