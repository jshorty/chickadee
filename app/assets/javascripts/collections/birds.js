Chickadee.Collections.Birds = Backbone.Collection.extend({
  initialize: function (options) {
    this.world = (options.world ? options.world : false)
  },

  model: Chickadee.Models.Bird,

  url: function () {
    return (this.world ? "/api/birds_all" : "/api/birds")
  },
})
