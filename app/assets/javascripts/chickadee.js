window.Chickadee = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var $header = $("header")
    var $main = $("#content");
    Chickadee.Routers.router = new Chickadee.Routers.Router({
      $header: $header, $main: $main
    })
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Chickadee.initialize();
});
