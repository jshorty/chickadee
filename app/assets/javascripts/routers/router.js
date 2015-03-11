Chickadee.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$main = options.$main

    Chickadee.Collections.regions = new Chickadee.Collections.Regions();
    this.regions = Chickadee.Collections.regions;
    this.regions.fetch();
  },

  routes: {
    "regions":"regionsIndex"
  },

  regionsIndex: function () {
    this._swapView(new Chickadee.Views.RegionsIndex({
      collection: this.regions
    }));
  },

  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$main.html(this.currentView.render().el);
  }

});
