Chickadee.Models.User = Backbone.Model.extend({
  urlRoot: "api/users",

  name: function () {
    return (this.get('alias') ? this.get('alias') : this.get('email'));
  }
})
