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
      this.listenTo(this.model.birds(), "sync", this.renderWithList);
      this.listenTo(this.model, "sync", this.renderWithList);
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

  render: function (isLoading) {
    this.removeSubviews();

    var content = this.template({
      region: this.model,
      // HACK: Get this flow untangled. Or better, get rid of Backbone.
      region_attrs: _.findWhere(this.collection.models, (r) => r.id === this.model.id).attributes,
      regions: this.collection,
    });
    this.$el.html(content);

    var birdIndex = new Chickadee.Views.BirdIndex({
      collection: this.model.birds()
    });
    this.subviews.push(birdIndex);
    setTimeout(function() {
      this.$(".bird-details .spinner").fadeOut(300, function() {
        this.$(".bird-details .region-details").fadeIn(300);
      }.bind(this));
    }, 1000);
    this.listenTo(birdIndex, "birdSelected", this.renderBird);
    this.$(".bird-list").append(birdIndex.render(isLoading || false).el);
    return this;
  },

  renderWithList: function () {
    this.render(true);
  },

  renderBird: function (data) {
    this.showSpinner = true;
    if (this.$(".region-details").length > 0) {
      this.$(".region-details").fadeOut(300, function() {
        if (this.showSpinner) {
          this.$(".spinner").fadeIn(300);
        }
      }.bind(this));
    } else {
      this.$(".bird-details").html(
        "<div class='spinner'><style type='text/css'>@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4166666666666667s;animation-delay: -0.4166666666666667s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.33333333333333337s;animation-delay: -0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.25s;animation-delay: -0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.16666666666666669s;animation-delay: -0.16666666666666669s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.08333333333333331s;animation-delay: -0.08333333333333331s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.08333333333333337s;animation-delay: 0.08333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.16666666666666663s;animation-delay: 0.16666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.25s;animation-delay: 0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(11){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.33333333333333337s;animation-delay: 0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(12){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.41666666666666663s;animation-delay: 0.41666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}</style><div class='uil-default-css' style='transform:scale(0.5);top:-12px;left:-5px;'><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:4px;position:absolute;'></div><div style='width:9px;;height:40px;background:#000000;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:4px;position:absolute;'></div></div></div>"
      );
    }
    $.ajax({
      url: "/api/birds/" + data.birdId,
      method: 'GET',
      success: function(data) {
        var bird = data;

        if (this.subviews.length == 2) {
          this.subviews[1].remove();
          this.subviews.pop();
        }
        this.showSpinner = false;
        var subview = new Chickadee.Views.BirdShow({model: bird});
        this.subviews.push(subview);
        this.$(".bird-details").html(subview.render().el);
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
