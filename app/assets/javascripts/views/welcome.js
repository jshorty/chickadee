Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function(){
    this.model = Chickadee.Models.currentUser;
    this.listenTo(this.model, "login", this.goToIndex);
  },

  tagName: "section",
  template: JST["welcome"],

  events: {
    "click .sign-up":"openSignUpWindow",
    "click .modal-backdrop":"closeSignUpWindow",
    "click .demo":"loginAsDemoUser"
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
    this.signUpWindow = new Chickadee.Views.SignUp();
    this.$el.append(this.signUpWindow.render().el);
    this.signUpWindow.$el.fadeIn(300)
  },

  closeSignUpWindow: function (event) {
    if (event.target === event.currentTarget) {
      this.signUpWindow.$el.fadeOut(300, function () {
        this.signUpWindow.remove();
      }.bind(this));
    }
  },

  loginAsDemoUser: function (event) {
    Chickadee.Models.currentUser.login({
      user: {
        email: "demouser@example.com",
        password: "password"
      }
    });
    Chickadee.Models.currentUser.firstTime = true;
  }
});
