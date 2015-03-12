Chickadee.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$main = options.$main;
    this.$header = options.$header;

    Chickadee.Collections.regions = new Chickadee.Collections.Regions();
    this.regions = Chickadee.Collections.regions;

    //INSECURE
    this.user = new Chickadee.Models.User({id: window.currentUserID});
    if (window.loggedIn) {
      this.headerView = new Chickadee.Views.HeaderPrivate();
      this.loggedIn = true
    } else {
      this.headerView = new Chickadee.Views.HeaderPublic();
      this.loggedIn = false
    }
    this.$header.html(this.headerView.render().el)
  },

  routes: {
    "":"rootView",
    "profile":"userProfile",
    "birds":"regionShow",
    "regions":"regionsIndex",
    "regions/new":"newRegion",
    "regions/:id/birds":"regionShow"
  },

  userProfile: function () {
    this.user.fetch();
    this._swapView(new Chickadee.Views.UserProfile({model: this.user}))
  },

  regionsIndex: function () {
    this.regions.fetch();
    this._swapView(new Chickadee.Views.RegionsIndex({
      collection: this.regions
    }));
  },

  newRegion: function () {
    var region = new Chickadee.Models.Region();
    this._swapView(new Chickadee.Views.RegionForm({model: region}));
  },

  regionShow: function (id) {
    var region = (id ? this.regions.getOrFetch(id) : null)
    this._swapView(new Chickadee.Views.RegionShow({
      model: region, collection: this.regions
    }));
  },

  rootView: function () {
    this.loggedIn ? this.regionsIndex() : this.welcome();
  },

  welcome: function () {
    this._swapView(new Chickadee.Views.Welcome());
  },

  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$main.html(this.currentView.render().el);
  }

});
