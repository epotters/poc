// EntityForm
define([
  "dojo/_base/declare",
  "dijit/form/Form",
  "dijit/form/TextBox",
  "dijit/form/Button",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, Form, TextBox, Button, domConstruct) {

  return declare([Form], {

    typeViewConfig: null,
    formGroupType: "div",

    constructor: function (params) {
      this.typeViewConfig = params.typeViewConfig;
      console.log("End of Entity Form constructor");
    },

    postCreate: function () {
      this.inherited(arguments);
      console.log("Start building Entity Form");
      this.addFields();
    },

    startup: function () {
      this.inherited(arguments);
    },

    addFields: function () {
      var formGroup, fieldName, fieldLabel, fields = [];
      var columns = this.typeViewConfig.columns;
      for (fieldName in columns) {
        if (columns.hasOwnProperty(fieldName)) {
          if (dojo.isObject(columns[fieldName])) {
            fieldLabel = columns[fieldName]["label"];
          } else {
            fieldLabel = columns[fieldName];
          }
          formGroup = this.buildFormGroup(fieldName, fieldLabel);
          fields[fieldName] = formGroup;
          domConstruct.place(formGroup, this.containerNode);
        }
      }
    },

    buildFormGroup: function (fieldName, fieldLabel) {
      var formGroup = domConstruct.create(this.formGroupType, {"class": "form-group form-group-sm"});
      domConstruct.create("label", {"for": fieldName, "innerHTML": fieldLabel}, formGroup);
      var control = new TextBox({
        name: fieldName,
        id: fieldName
      });
      dojo.addClass(control.domNode, "form-control");
      control.placeAt(formGroup);
      return formGroup;
    }
  });
});
