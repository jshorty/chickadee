Chickadee.Views.Home = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = [];
    this.regions = options.regions;
    this.needRandomBirdPhoto = true;
  },

  className: "home",
  template: JST["home"],

  events: {
    "click .region-item":"displayRegionDetails",
    "click .study-button":"goToQuiz",
  },

  displayRegionDetails: function (event) {
    var region = {
      id: $(event.currentTarget).data("region_id"),
      name: $(event.currentTarget).data("name"),
      map_url: $(event.currentTarget).data("map_url"),
    }
    if (this.regionDetails) {
      this.regionDetails.remove();
    }
    this.regionDetails = new Chickadee.Views.RegionDetails({region: region});
    this.subviews.push(this.regionDetails);
    this.$("#region-details").html(this.regionDetails.render().el);
    this.needRandomBirdPhoto = false;
    // If screen size is small, jump to the details pane.
    if (!window.matchMedia('(min-width: 1081px)').matches) {
      document.getElementById("region-details").scrollIntoView();
    }
  },

  goToQuiz: function (event) {
    var region_id = $(event.currentTarget).data().id;
    this.$el.fadeOut(200, function () {
      Backbone.history.navigate("#quiz/" + region_id, {trigger: true})
    });
  },

  loadRandomBirdImage: function() {
    if (!this.needRandomBirdPhoto) {
      return;
    }
    $.ajax({
      url: "/api/birds/random_image",
      method: 'GET',
      success: function(photo) {
        if (!this.needRandomBirdPhoto) {
          return;
        }
        var attribution = photo.bird +
          ". Photograph by " + (photo.owner) + " via Flickr."
        this.$('.spinner').fadeOut(200, function() {
          this.$(".image-wrapper").html(
            '<img class="bird-image" src="' + photo.url + '"><div class="bird-info"><a href="' +
              photo.flickr_url + '">' + attribution + '</a><br><a href="' + photo.flickr_url + '">' +
              '(Click for license and info)</a></div>'
          );
          this.$('.bird-image').css('display', 'none');
          this.$('.bird-info').css('display', 'none');
          this.$('.bird-info').fadeIn(1000);
          this.$('.bird-image').fadeIn(1000);
        }.bind(this));
      }.bind(this),
    });
  },

  render: function () {
    this.$el.html(this.template());

    var regionsIndex = new Chickadee.Views.RegionsIndex({collection: this.regions});
    this.subviews.push(regionsIndex);
    var leaderboard = new Chickadee.Views.Leaderboard({collection: this.regions});
    this.subviews.push(leaderboard);
    this.needToClearDetailsPane = true;
    this.$("#region-menu").html(regionsIndex.render().el)
    this.loadRandomBirdImage();
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
});
