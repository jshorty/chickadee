Chickadee.Views.RegionsIndex = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.listenTo(this.collection, "add remove sync", this.render)
  },

  template: JST["regions_index"],

  events: {
    "click .new-region-link":"newRegion",
    "click .region-item":"goToQuiz"
  },

  newRegion: function (event) {
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("regions/new", {trigger:true});
    });
  },

  goToQuiz: function (event) {
    var region_id = $(event.currentTarget).data("id");
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("#quiz/" + region_id, {trigger: true})
    });
  },

  render: function () {
    var content = this.template({regions: this.collection});
    this.$el.html(content);

    this.$(".hints").hide();

    this.collection.each(function (region) {
      var subview = new Chickadee.Views.RegionsIndexItem({model: region});
      this.subviews.push(subview);
      this.$el.find(".region-menu").prepend(subview.render().el);
    }, this);

    if (this.collection.models.length === 0) {
      this.$el.find(".region-item").addClass("solo-centered");
    }

    if (Chickadee.Models.currentUser.firstTime) {
      this.flashHints();
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

  flashHints: function () { //brace yourself
    this.$("#hints-home1").fadeIn(1000, function () {
      setTimeout(function () {
        this.$("#hints-home1").fadeOut(600);
        this.$("#hints-home2").fadeIn(1000, function () {
          setTimeout(function () {
            this.$("#hints-home2").fadeOut(600);
            this.$("#hints-home3").fadeIn(1000, function () {
              setTimeout(function () {
                Chickadee.Models.currentUser.firstTime = false;
                this.$("#hints-home3").fadeOut(600);
              }, 4000)
            })
          }, 4000)
        })
      }, 4000)
    });
  }
})
