Chickadee.Views.RegionDetails = Backbone.View.extend({
  initialize: function(options) {
    this.region = options.region;
  },

  template: JST['region_details'],
  className: 'region-details',

  render: function() {
    this.$el.html(this.template({region: this.region}));

    setTimeout(function() {
      this.$('#google-maps').ready(function(){
        this.$('.spinner').fadeOut(200, function() {
            this.$('#google-maps').fadeIn(2500);
          }.bind(this));
        }.bind(this)
      );
    }.bind(this), 50)

    return this;
  },
});
