Chickadee.Models.Region = Backbone.Model.extend({
  urlRoot: "/api/regions",

  birds: function () {
    if (!this._birds) {
      this._birds = new Chickadee.Collections.Birds([], {region: this})
    }
    return this._birds;
  },

  parse: function (payload) {
    if (payload.birds) {
      this.birds().set(payload.birds);
      delete payload.birds;
    }
    return payload;
  },

  name: function () {
    var county = this.get('county');
    var state = this.get('state');
    var country = this.get('country')

    if (!state) {
      return country;
    } else if (!county) {
      return state + ", " + country;
    } else {
      return county + ", " + state + ", " + country;
    }
  }
});
