Chickadee.Views.Welcome = Backbone.View.extend({
  initialize: function(){
    this.model = Chickadee.Models.currentUser;
    this.listenTo(this.model, "login", this.goToIndex);
    setTimeout(this.randomBirdSong.bind(this), 1000);
  },

  tagName: "section",
  template: JST["welcome"],

  events: {
    "click .sign-up":"openSignUpWindow",
    "click .modal-backdrop":"closeSignUpWindow",
    "click .demo":"loginAsDemoUser"
  },

  randomBirdSong: function(){
    $.getJSON(
      "/api/random_song",
      function(response){
        this.songInfo = response;
        this.render();
      }.bind(this)
    );
  },

  render: function(){
    var songInfo = this.songInfo || {};
    this.$el.html(this.template({songInfo: songInfo}));
    if (this.songInfo) { // Fade in the song sampler
      setTimeout(function() {
        this.$el.find('#song-sampler').css('opacity', '1.0');
      }.bind(this), 1000);
    }
    return this;
  },

  remove: function(){
    Backbone.View.prototype.remove.call(this);
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
