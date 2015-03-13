Chickadee.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$main = options.$main;
    this.$header = options.$header;

    this.session = Chickadee.Models.session;
    this.session.fetch();

    Chickadee.Collections.regions = new Chickadee.Collections.Regions();
    this.regions = Chickadee.Collections.regions;
    this.regions.fetch();

    this.headerView = new Chickadee.Views.Header()
    this.$header.html(this.headerView.render().el);
  },

  routes: {
    "":"welcome",
    "profile/:id":"userProfile",
    "birds":"regionShow",
    "regions":"regionsIndex",
    "regions/new":"newRegion",
    "regions/:id/birds":"regionShow"
  },

  userProfile: function (id) {
    var user = new Chickadee.Models.User({id: id})
    user.fetch();
    this._swapView(new Chickadee.Views.UserProfile({model: user}))
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

  root: function () {
    if (this.session.get('loggedIn')) {
      return this.regionsIndex();
    } else {
      return this.welcome();
    }
  },

  welcome: function () {
    this._swapView(new Chickadee.Views.Welcome({model: this.session}));
  },

  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$header.html(this.headerView.render().el);
    this.$main.html(this.currentView.render().el);
  }

});
