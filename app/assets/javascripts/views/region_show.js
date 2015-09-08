Chickadee.Views.RegionShow = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];

    if (!options.model) {
      this.model = this.collection.models[0];
      this.model && this.model.set('id', this.model.get('region_id'))
    }

    if (!this.model) {
      this.template = JST["no_birds"]
      this.render = function(){this.$el.html(this.template); return this};
    } else {
      this.$el.addClass("group");
      this.listenTo(this.model.birds(), "sync", this.render);
      this.listenTo(this.model, "sync", this.render);
    }
  },

  template: JST["region_show"],

  className: "region-show",

  events: {
    "click .region-button":"swapBirdIndex",
    "click .region-update":"reloadRegionBirds",
    "click .quiz-start":"goToQuiz",
    "input .search-bar":"updateResults",
    "change .region-chooser":"swapRegion"
  },

  render: function () {
    this.removeSubviews();
    var content = this.template({region: this.model,
                                 regions: this.collection});
    this.$el.html(content);

    var birdIndex = new Chickadee.Views.BirdIndex({
      collection: this.model.birds()
    });
    this.subviews.push(birdIndex);
    this.listenTo(birdIndex, "birdSelected", this.renderBird);
    this.$el.find(".bird-list").append(birdIndex.render().el);
    return this;
  },

  renderBird: function (data) {
    $.ajax({
      url: "/api/birds/" + data.birdId,
      method: 'GET',
      success: function(data) {
        var bird = data;

        if (this.subviews.length == 2) {
          this.subviews[1].remove();
          this.subviews.pop();
        }

        var subview = new Chickadee.Views.BirdShow({model: bird});
        this.subviews.push(subview);
        this.$el.find(".bird-details").prepend(subview.render().el);
      }.bind(this)
    });
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });
    this.subviews = [];
  },

  showAllUserBirds: function () {
    this.model = new Chickadee.Models.Region()
    this.model.name = function () {
      return "All Birds";
    }

    var birds = new Chickadee.Collections.Birds({world: true})
    birds.fetch();
    this.model.birds = function () {
      return birds;
    };
  },

  swapBirdIndex: function (event) {
    var region_id = $(event.currentTarget).data("region_id");
    if (this.model.get('region_id') === region_id) { return }
    var url = "regions/" + region_id + "/birds";
    this.$el.find(".bird-list li").fadeOut(200);
    this.$el.find(".region-header").fadeOut(200, function () {
      Backbone.history.navigate(url, { trigger: true });
    });
  },

  swapRegion: function (event) {
    url = "regions/" + $(event.currentTarget).val() + "/birds";
    this.$el.find(".bird-list li").fadeOut(200);
    this.$el.find(".region-header").fadeOut(200, function () {
      Backbone.history.navigate(url, { trigger: true });
    });
  },

  reloadRegionBirds: function (event) {
    this.model.fetch({data: {requery: true}});
  },

  goToQuiz: function (event) {
    var region_id = $(event.currentTarget).data("region_id");
    this.$el.find(".bird-list li").fadeOut(200);
    this.$el.find(".region-header").fadeOut(200, function () {
      Backbone.history.navigate("#quiz/" + region_id, {trigger: true})
    });
  },

  updateResults: function (event) {
    var query = $(event.currentTarget).val().toLowerCase();
    this.$el.find(".bird-list li").each(function (i, el) {
      if ($(el).text().toLowerCase().indexOf(query) === -1) {
        $(el).hide();
      } else {
        $(el).show();
      }
    });
  }
})
