Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function(){
    this.model = Chickadee.Models.currentUser;
    this.subviews = [];
    this.listenTo(this.model, "login", this.goToIndex);
  },

  tagName: "section",
  className: "welcome-page group",
  template: JST["welcome"],

  events: {
    "click .sign-up":"openSignUpWindow",
  },

  render: function(){
    this.$el.html(this.template());
    return this;
  },

  remove: function(){
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
  },

  goToIndex: function(){
    Backbone.history.navigate("regions", {trigger:true})
  },

  openSignUpWindow: function(event){
    var subview = new Chickadee.Views.SignUp();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  },
});
