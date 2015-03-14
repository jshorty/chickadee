Chickadee.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$main = options.$main;
    this.$header = options.$header;
    this.$header.html(new Chickadee.Views.Header().render().el);
    this.regions = Chickadee.Collections.regions;
  },

  routes: {
    "":"welcome",
    "profile":"userProfile",
    "birds":"regionShow",
    "quiz/:regionId":"quizShow",
    "regions":"regionsIndex",
    "regions/new":"newRegion",
    "regions/:id/birds":"regionShow",
    "*nomatch":"notFound"
  },

  newRegion: function () {
    if (this._requireLoggedIn()) {
      var region = new Chickadee.Models.Region();
      this._swapView(new Chickadee.Views.RegionForm({model: region}));
    } else {
      this._swapView(new Chickadee.Views.Welcome());
    }
  },

  notFound: function () {
    this._swapView(new Chickadee.Views.NotFound());
  },

  quizShow: function (regionId) {
    if (this._requireLoggedIn()) {
      console.log("going!");
      var quiz = new Chickadee.Models.Quiz();
      console.log("about to save");
      quiz.save({region_id: regionId}, {
        success: function () {
          console.log("successful save");
          this._swapView(new Chickadee.Views.QuizShow({model: quiz}));
        }.bind(this)
      });
      console.log("kept going past save");
    } else {
      this._swapView(new Chickadee.Views.Welcome());
    }
  },

  regionsIndex: function () {
    if (this._requireLoggedIn()) {
      this.regions.fetch();
      this._swapView(new Chickadee.Views.RegionsIndex({
        collection: this.regions
      }));
    } else {
      this._swapView(new Chickadee.Views.Welcome());
    }
  },

  regionShow: function (id) {
    if (this._requireLoggedIn()) {
      var region = (id ? this.regions.getOrFetch(id) : null)
      this._swapView(new Chickadee.Views.RegionShow({
        model: region, collection: this.regions
      }));
    } else {
      this._swapView(new Chickadee.Views.Welcome());
    }
  },

  userProfile: function () {
    if (this._requireLoggedIn()) {
      this._swapView(new Chickadee.Views.UserProfile({
        model: Chickadee.Models.currentUser
      }));
    } else {
      this._swapView(new Chickadee.Views.Welcome());
    }
  },

  welcome: function () {
    if (this._requireLoggedOut()) {
      this._swapView(new Chickadee.Views.Welcome({
        model: Chickadee.Models.currentUser
      }));
    } else {
    Backbone.history.navigate("regions", {trigger: true})
    }
  },

  _requireLoggedIn: function () {
    var loggedIn = (!!Chickadee.Models.currentUser.isLoggedIn() ? true : false);
    return loggedIn;
  },

  _requireLoggedOut: function () {
    var loggedOut = (!Chickadee.Models.currentUser.isLoggedIn() ? true : false);
    return loggedOut;
  },

  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$main.html(this.currentView.render().el);
  },
});
