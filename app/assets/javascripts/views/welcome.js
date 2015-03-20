Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function(){
    this.model = Chickadee.Models.currentUser;
    this.subviews = [];
    this.listenTo(this.model, "login", this.goToIndex);

    $("#main-content").css("background", "transparent")
  },

  tagName: "section",
  className: "welcome-page group",
  template: JST["welcome"],

  events: {
    "click .sign-up":"openSignUpWindow",
    "click .back-button":"closeSignUpWindow"
  },

  render: function(){
    this.$el.html(this.template());
    return this;
  },

  remove: function(){
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
    $("#main-content").css("background", "#eee")
  },

  goToIndex: function(){
    Backbone.history.loadUrl();
  },

  openSignUpWindow: function(event){
    var subview = new Chickadee.Views.SignUp();
    this.subviews.push(subview);
    this.$el.prepend(subview.render().el);
    this.$(".modal-backdrop").fadeIn(300, function () {
      this.$(" > .tree-footer").hide();
    }.bind(this))
  },

  closeSignUpWindow: function (event) {
    this.$(" > .tree-footer").show();
    this.$(".modal-backdrop").fadeOut(300, function () {
      this.render()
    }.bind(this))
  }
});
