Chickadee.Views.RegionForm = Backbone.View.extend({
  initialize: function (options) {},

  tagName: "form",

  events: {
    "submit":"submitNewRegion"
  },

  template: JST["region_form"],

  render: function () {
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },

  submitNewRegion: function (event) {
    event.preventDefault();
    var attr = $(event.currentTarget).serializeJSON();
    this.model.save(attr, {
      success: function () {console.log("SAVE SUCCESS!");},
      error: function () {console.log("SAVE FAIL...");}
    });
  }
})
