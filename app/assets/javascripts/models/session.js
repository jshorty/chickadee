// Chickadee.Models.Session = Backbone.Model.extend({
//   urlRoot: "api/session",
//
//   login: function (credentials, success) {
//     this.set(credentials);
//     this.save({}, {
//       success: success,
//       error: function () {
//         console.log("Error logging in.");
//       },
//     });
//   },
//
//   logout: function (callback) {
//     var session = this;
//     $.ajax({
//       url: "/api/session",
//       method: 'DELETE',
//       success: function() {
//         session.clear();
//         Backbone.history.navigate("", { trigger: true });
//       }
//     });
//   }
// });
//
// Chickadee.Models.session = new Chickadee.Models.Session();
