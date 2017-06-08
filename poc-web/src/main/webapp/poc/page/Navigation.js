// Navigation
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/Navigation.html",
  "dojo/i18n!./nls/Navigation"
], function (declare,
             _WidgetBase,
             _TemplatedMixin,
             template,
             nls) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    postCreate: function () {
      this.inherited(arguments);
      this.homeNode.innerHTML = nls.homeLabel;
      this.peopleNode.innerHTML = nls.peopleLabel;
      this.organizationsNode.innerHTML = nls.organizationsLabel;
    }
  });
});
