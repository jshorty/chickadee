Chickadee.Collections.Regions = Backbone.Collection.extend({
  model: Chickadee.Models.Region,
  url: "/api/regions",

  comparator: function (regionA, regionB) {
    if (!regionA || !regionB) { return }
    if (regionA.name() > regionB.name()) {
      return -1;
    } else if (regionA.name() < regionB.name()) {
      return 1;
    } else {
      return 0;
    }
  },

  getOrFetch: function (region_id) {
    var model = this.get(region_id);
    var collection = this;

    if (!model) {
      model = new Chickadee.Models.Region({id: region_id});
      model.fetch({
        success: function () {
          collection.add(model, {merge: true});
        }
      });
    } else {
      model.fetch();
    }

    return model;
  }
});
