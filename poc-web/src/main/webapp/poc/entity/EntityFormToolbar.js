// EntityFormToolbar
define([
  "dojo/_base/declare",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, Button, Toolbar, domConstruct) {
  return declare([Toolbar], {

    form: null,
    buttonClass: "btn btn-sm btn-default",

    constructor: function (params) {

      this.form = params.form;

    },

    postCreate: function () {

      this.inherited(arguments);

      var me = this;

      var previousButton = new Button({
        label: "Previous",
        icon: "arrow-left",
        onClick: function () {
          console.log("Go to the previous entity");
        }
      });
      dojo.addClass(previousButton.domNode, this.buttonClass);
      this.addChild(previousButton);

      var nextButton = new Button({
        label: "Next",
        icon: "arrow-right",
        onClick: function () {
          console.log("Go to the next entity");
        }
      });
      dojo.addClass(nextButton.domNode, this.buttonClass);
      this.addChild(nextButton);


      var saveButton = new Button({
        label: "Save",
        icon: "glyphicon-ok",
        onClick: function () {
          console.log("Save changes to this entity");
        }
      });
      dojo.addClass(saveButton.domNode, this.buttonClass);
      this.addChild(saveButton);


      var cancelButton = new Button({
        label: "Cancel",
        icon: "glyphicon-ok",
        onClick: function () {
          console.log("Discard changes to this entity");
        }
      });
      dojo.addClass(cancelButton.domNode, this.buttonClass);
      this.addChild(cancelButton);
    }
  });

});
