Chickadee.Collections.Regions = Backbone.Collection.extend({
  model: Chickadee.Models.Region,
  url: "/api/regions",

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
