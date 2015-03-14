window.Chickadee = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var $header = $("#header-content")
    var $main = $("#main-content");

    Chickadee.Collections.regions = new Chickadee.Collections.Regions()
    Chickadee.Collections.regions.fetch();

    Chickadee.Models.currentUser = new Chickadee.Models.CurrentUser();
    Chickadee.Models.currentUser.fetch({
      success: function () {
        Chickadee.Routers.router = new Chickadee.Routers.Router({
          $header: $header, $main: $main
        })

        Backbone.history.start();
      }
    });
  }
};

$(document).ready(function(){
  Chickadee.initialize();
});
