Chickadee.Collections.Regions = Backbone.Collection.extend({
  model: Chickadee.Models.Region,
  url: "/api/regions",

  getOrFetch: function (id) {
    var model = this.get(id);
    var collection = this;

    if (!model) {
      model = new Chickadee.Models.Region({id: id});
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
})
