Chickadee.Views.RegionForm = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = []
    $.ajax({
      url: "api/countries",
      method: "GET",
      success: function (data) {
        this.countryList = data
        this.$el.find("#new-region-country").autocomplete({
          minLength: 3,
          source: this.countryList
        })
      }.bind(this)
    });
  },

  tagName: "form",
  className: "invisible",

  events: {
    "submit":"submitNewRegion",
    "click .back-button":"goToIndex"
  },

  template: JST["region_form"],

  render: function () {
    this.showSpinner = false
    this.removeSubviews()
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },

  submitNewRegion: function (event) {
    event.preventDefault();
    var attr = $(event.currentTarget).serializeJSON();
    var view = this;

    var timer = setTimeout( function () {
      this.$("fieldset").fadeOut(300, function () {
        view.$el.find(".spinner-box")
                .html('<img class="spinner" src="spinner-light.gif">')
      });
    }, 500);

    view.model.save(attr, {
      success: function () {
          clearTimeout(timer);
          Chickadee.Collections.regions.add(view.model);
          view.goToIndex();
      },
      error: function (model, response) {
        view.showSpinner = false;
        view.$el.find("fieldset").html(view.fields);
        view.displayErrors(response.responseJSON);
      }
    });
  },

  displayErrors: function (errors) {
    this.removeSubviews();
    var subview = new Chickadee.Views.Errors({errors: errors});
    this.subviews.push(subview)
    this.$el.find("p").append(subview.render().el)
    this.$el.find(".error-message").css('opacity', 0)
                                   .slideDown(300)
                                   .animate(
                                     { opacity: 1 },
                                     { queue: false, duration: 1000 }
                                    );
  },

  remove: function () {
    this.showSpinner = false;
    Chickadee.Views.RegionsIndex.prototype.remove.call(this);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });
    this.subviews = [];
  },

  goToIndex: function (event) {
    event && event.preventDefault();
    this.$el.fadeOut(300, function () {
      Backbone.history.navigate("regions", {trigger: true})
    });
  }
})
