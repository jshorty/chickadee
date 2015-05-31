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
  className: "invisible centered-form",

  events: {
    "submit":"submitNewRegion",
    "click .back-button":"goToIndex",
    "click #new-region-state":"checkForCountry",
    "click #new-region-county":"checkForState"
  },

  template: JST["region_form"],

  render: function () {
    this.showSpinner = false
    this.removeSubviews()
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },

  checkForCountry: function (event) {
    if (this.$("#new-region-country").val() == "") {
      $(event.currentTarget).val("Enter a country first!")
    }
  },

  checkForState: function (event) {
    if (this.$("#new-region-state").val() == "") {
      $(event.currentTarget).val("Enter a state first!")
    }
  },

  capitalizeRegion: function (region) {
    if (region["country"] != "") {
      region["country"] = this.capitalizeMostWords(region["country"]);
    }

    if (region["state"] === "Enter a country first!") {
      region["state"] = "";
    } else if (region["state"] != "") {
      region["state"] = this.capitalizeMostWords(region["state"]);
    }

    if (region["county"] === "Enter a state first!") {
      region["county"] = "";
    } else if (region["county"] != "") {
      region["county"] = this.capitalizeMostWords(region["county"]);
    }

    return region;
  },

  capitalizeMostWords: function (str) {
    var new_str = [];
    str.split(" ").forEach(function (word) {
      if (word != "and" && (word != "of" && word != "the")) {
        new_str.push(word[0].toUpperCase()
                     + word.substring(1, word.length).toLowerCase());
      }
    })
    return new_str.join(" ");
  },

  submitNewRegion: function (event) {
    event.preventDefault();
    var attr = $(event.currentTarget).serializeJSON();
    this.capitalizeRegion(attr["region"]);
    var view = this;
    view.showSpinner = true;

    var timer = setTimeout( function () {
      if (view.showSpinner) {
        this.$("fieldset").fadeOut(300, function () {
          view.$el.find(".spinner-box")
                  .html('<img class="spinner" src="spinner-light.gif">')
        });
      }
    }, 500);

    view.model.save(attr, {
      success: function () {
          clearTimeout(timer);
          Chickadee.Collections.regions.add(view.model);
          view.goToIndex();
      },
      error: function (model, response) {
        view.showSpinner = false;
        view.$("fieldset").fadeIn(300);
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
