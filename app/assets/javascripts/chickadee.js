window.Chickadee = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var $main = $("#content");
    Chickadee.Routers.router = new Chickadee.Routers.Router({$main: $main})
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Chickadee.initialize();
});
