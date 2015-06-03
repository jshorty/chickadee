Chickadee.Views.RegionsIndex = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.listenTo(this.collection, "add remove sync", this.render)
    this.listenTo(this.collection, "sync", this.checkForGreeting)
    this.listenTo(this.collection, "sync", this.readjustHeight)
  },

  template: JST["regions_index"],

  events: {
    "click .new-region-link":"newRegion",
    "click .region-item":"goToQuiz",
    "click .modal-backdrop":"closeGreeting",
    "click .greeting-button":"closeGreeting",
  },

  newRegion: function (event) {
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("regions/new", {trigger:true});
    });
  },

  goToQuiz: function (event) {
    var region_id = $(event.currentTarget).data("region_id");
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("#quiz/" + region_id, {trigger: true})
    });
  },

  readjustHeight: function () {
    Chickadee.Routers.router.readjustHeight();
  },

  render: function () {
    var content = this.template({regions: this.collection});
    this.$el.html(content);

    this.collection.each(function (region) {
      var subview = new Chickadee.Views.RegionsIndexItem({model: region});
      this.subviews.push(subview);
      this.$el.find(".region-menu").prepend(subview.render().el);
    }, this);

    if (this.collection.models.length === 0) {
      this.$el.find(".region-item").addClass("solo-centered");
    }

    return this;
  },

  remove: function () {
    var view = this;
    Backbone.View.prototype.remove.call(view);
    view.subviews.forEach(function (subview) {
      subview.remove();
    });
    view.subviews = [];
  },

  checkForGreeting: function () {
    if (Chickadee.Models.currentUser.firstTime) {
      setTimeout(function () {
        this.displayGreeting();
      }.bind(this), 500);
    }
  },

  displayGreeting: function () {
    this.greetingWindow = new Chickadee.Views.GreetingWindow();
    this.$el.append(this.greetingWindow.render().el);
    this.greetingWindow.$el.fadeIn(300);
  },

  closeGreeting: function (event) {
    if (event.target === event.currentTarget) {
      this.greetingWindow.$el.fadeOut(300, function () {
        this.greetingWindow.remove();
        Chickadee.Models.currentUser.firstTime = false;
      }.bind(this));
    }
  },
})
