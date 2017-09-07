// UserPanel
define([
  "dojo/_base/declare",
  "dojo/dom-style",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/UserPanel.html"
], function (declare,
             domStyle,
             _WidgetBase,
             _TemplatedMixin,
             template) {
  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    user: null,

    constructor: function (params) {
      this.user = params.user;
    },


    postCreate: function () {
      this.inherited(arguments);
    },


    show: function () {
      domStyle.set(this.domNode, "display", "");
    },

    hide: function () {
      domStyle.set(this.domNode, "display", "none");
    }

  });
});
