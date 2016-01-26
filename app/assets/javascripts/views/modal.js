Chickadee.Views.Modal = Backbone.View.extend({
  initialize: function(options) {
    this.header = options.header || null;
    this.message = options.message || null;
    this.isConfirm = options.isConfirm || false;
    this.confirmCallback = options.confirmCallback || function() {};
    this.denyCallback = options.denyCallback || function() {};
  },

  events: {
    "click .confirm-true": "closeAndConfirm",
    "click .confirm-false": "closeAndDeny",
    "click .ok-button": "close"
  },

  template: JST["modal"],
  className: 'modal-backdrop',

  close: function() {
    this.remove();
  },

  closeAndConfirm: function() {
    this.remove();
    this.confirmCallback();
  },

  closeAndDeny: function() {
    this.remove();
    this.denyCallback();
  },

  render: function () {
    this.$el.html(
      this.template({
        header: this.header,
        message: this.message,
        isConfirm: this.isConfirm
      })
    );
    return this;
  },
})
