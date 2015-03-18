Chickadee.Views.RegionForm = Backbone.View.extend({
  initialize: function (options) {
    this.subviews = []
  },

  tagName: "form",
  className: "invisible",

  events: {
    "submit":"submitNewRegion",
    "click .back-button":"goToIndex"
  },

  template: JST["region_form"],

  render: function () {
    this.removeSubviews()
    var content = this.template({region: this.model});
    this.$el.html(content);
    return this;
  },

  submitNewRegion: function (event) {
    event.preventDefault();
    var attr = $(event.currentTarget).serializeJSON();
    var view = this;

    $( document ).ajaxStart(function() {
      view.fields = view.$el.find("fieldset").html();
      $(view.fields).fadeOut(500, function () {
        view.$el.find("fieldset").html(
          '<img class="spinner" src="../spinner.gif">')
      })
    });

    view.model.save(attr, {
      success: function () {
          Chickadee.Collections.regions.add(view.model);
          view.goToIndex();
      },
      error: function (model, response) {
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
