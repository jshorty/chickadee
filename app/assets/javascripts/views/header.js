Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    console.log("header loaded");
    this.subviews = [];

    this.model = Chickadee.Models.session;
    this.model.fetch();

    this.listenTo(this.model, "sync", this.checkLoggedIn);
  },

  template: JST["header_public"],

  events: {
    "click .login":"openLoginWindow",
    "click .logout":"logout",
    "submit form":"login",
  },

  checkLoggedIn: function () {
    console.log("session sync detected!");
    if (this.model.get('logged_in') === true) {
      console.log("current user detected!");
      var options = {user: this.model.get('user')};
      this.template = JST["header_private"];
      return this.render(options);
    } else {
      this.template = JST["header_public"];
      return this.render();
    }
  },

  render: function (options) {
    console.log("header rendering");
    console.log(this.model.attributes);
    console.log(this.model.get('logged_in'));
    this.$el.html(this.template(options));
    return this;
  },

  openLoginWindow: function (event) {
    var subview = new Chickadee.Views.Login();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.protoype.remove.call(this)
  },

  login: function (event) {
    var data = $(event.currentTarget).serializeJSON();
    this.model = new Chickadee.Models.Session(data);
    this.model.save({
      success: function () {
        this.template = JST["header_private"];
        Backbone.history.navigate("#regions", { trigger: true });
      }.bind(this),
      error: function () {
      }
    })
  },

  logout: function (event) {
    this.model.destroy();
    this.template = JST["header_public"];
    this.render();
    Backbone.history.navigate("", { trigger: true });
  }
})
