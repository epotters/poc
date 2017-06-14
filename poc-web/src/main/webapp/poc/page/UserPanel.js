// UserPanel
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/UserPanel.html"
], function (declare,
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

      console.log("postCreate UserPanel");
    }
  });
});
