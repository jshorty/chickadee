Chickadee.Views.Modal = Backbone.View.extend({
  initialize: function(options) {
    this.header = options.header || null;
    this.bigHeader = options.header || false;
    this.message = options.message || null;
    this.isConfirm = options.isConfirm || false;
    this.confirmCallback = options.confirmCallback || function() {};
    this.denyCallback = options.denyCallback || function() {};
    this.useButtons = options.useButtons || false;
    this.buttons = options.buttons || []; // [{text: "text", class: "class"}]
  },

  events: {
    "click .confirm-true": "closeAndConfirm",
    "click .confirm-false": "closeAndDeny",
    "click .ok-button": "close"
  },

  template: JST["modal"],
  className: 'modal-backdrop modal-backdrop-orange',

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
    _.each(this.buttons, (button)=> {button.class += " button button-green"});
    this.$el.html(
      this.template({
        useButtons: this.useButtons,
        buttons: this.buttons,
        header: this.header,
        message: this.message,
        isConfirm: this.isConfirm
      })
    );
    if (this.useButtons) {
      this.$el.find('.modal-window').css('height', this.buttons.length * 100 + "px");
      if (this.bigHeader) {
        this.$el.find('.modal-header').css('font-size', '36px');
      }
    }
    return this;
  },
})
