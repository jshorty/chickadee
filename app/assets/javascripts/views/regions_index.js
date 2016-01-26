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
    "click .view-toggle":"toggleView",
    "click .delete-region":"openDeleteModal",
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
    this.viewMode = 'icon';
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
    this.greetingWindow = new Chickadee.Views.Modal({
      header: "Welcome to Chickadee!",
      message: "Chickadee allows you learn bird songs by studying species from the regions of your choice.\n" +
        "This is where we'll keep track of the regions that you're studying.\n" +
        "Click \"New Region\" to get started!"
    });
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

  toggleView: function (event) {
    if (this.viewMode === 'icon') {
      this.$el.find('.region-menu-buttons:first').css('display', 'none');
      this.$el.find('.region-menu-list:first').css('display', 'block');
      this.$el.find('.view-toggle:first').html('Show Icon View');
    } else {
      this.$el.find('.region-menu-list:first').css('display', 'none');
      this.$el.find('.region-menu-buttons:first').css('display', 'block');
      this.$el.find('.view-toggle:first').html('Show List View');
    }
    this.viewMode = this.viewMode === 'icon' ? 'list' : 'icon';
  },

  openDeleteModal: function(event) {
    event.stopPropagation();
    var subview = new Chickadee.Views.Modal({
      message: "You will lose all experience and statistics if you delete this region.",
      isConfirm: true,
      confirmCallback: function() {
        this.deleteRegion(event);
      }.bind(this)
    })
    this.$el.prepend(subview.render().el);
  },

  deleteRegion: function(event) {
    var id = $(event.currentTarget).parent().data()["region_id"];
    $.ajax({
      url: "/api/regions/" + id.toString(),
      method: 'DELETE',
      success: function() {
        this.collection.fetch();
      }.bind(this)
    });
  }
})
