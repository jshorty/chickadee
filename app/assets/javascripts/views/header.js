Chickadee.Views.Header = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];

    this.model = Chickadee.Models.session;

    this.listenTo(this.model, "sync", this.render);
  },

  template: JST["header_public"],

  events: {
    "click .login":"openLoginWindow",
    "click .logout":"logout",
    "submit form":"login",
  },

  render: function (options) {
    var content = this.checkLoggedIn();
    this.$el.html(content);
    return this;
  },

  remove: function () {
    Chickadee.Views.RegionsIndex.prototype.remove.call(this)
  },

  openLoginWindow: function (event) {
    var subview = new Chickadee.Views.Login();
    this.subviews.push(subview);
    this.$el.append(subview.render().el);
  },

  checkLoggedIn: function () {
    if (this.model.get('logged_in') === true) {
      var userData = this.model.get('user')
      var user = new Chickadee.Models.User(userData);
      return JST["header_private"]({user: user});
    } else {
      return JST["header_public"]();
    }
  },

  login: function (event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();
    this.model = new Chickadee.Models.Session(data);
    this.model.save({}, {
      success: function () {
        this.render();
        Backbone.history.navigate("#regions", { trigger: true });
      }.bind(this),
      error: function () {
        console.log("Error signing in.");
      }
    })
  },

  logout: function (event) {
    $.ajax({url: "/api/session", method: 'DELETE'})
    this.model.fetch();
    Backbone.history.navigate("", { trigger: true });
  }
});
