// EntityForm
define([
  "dojo/_base/declare",
  "dijit/form/Form",
  "dijit/form/TextBox",
  "dijit/form/Select",
  "dijit/form/Button",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, Form, TextBox, Select, Button, domConstruct) {

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

    addFields: function () {
      var defaultEditorType = "text";
      var formGroup, fieldName;
      var columns = this.typeViewConfig.columns;
      for (fieldName in columns) {
        if (columns.hasOwnProperty(fieldName)) {
          fieldConfig = {};
          if (dojo.isObject(columns[fieldName])) {
            fieldConfig = columns[fieldName];
          } else {
            fieldConfig.name = fieldName;
            fieldConfig.label = columns[fieldName];
          }

          fieldConfig.editor = (fieldConfig.editor) ? fieldConfig.editor : defaultEditorType;
          formGroup = this.buildFormGroup(fieldName, fieldConfig);
          domConstruct.place(formGroup, this.containerNode);
        }
      }
    },

    buildFormGroup: function (fieldName, fieldConfig) {
      var formGroup = domConstruct.create(this.formGroupType, {"class": "form-group form-group-sm"});
      domConstruct.create("label", {"for": fieldName, "innerHTML": fieldConfig.label}, formGroup);
      var control = this.buildControl(fieldName, fieldConfig);
      dojo.addClass(control.domNode, "form-control");
      control.placeAt(formGroup);
      return formGroup;
    },


    buildControl: function (fieldName, fieldConfig) {


      fieldConfig.options = (fieldConfig.options) ? fieldConfig.options : [];

      switch (fieldConfig.editor) {
        case "select":
          console.log("About to build a select");
          return this.buildSelect(fieldName, fieldConfig);
          break;
        default:
          return new TextBox({
            name: fieldName,
            id: fieldName
          });
      }
    },


    buildSelect: function (fieldName, fieldConfig) {

      console.log(fieldConfig);

      var options = (fieldConfig.editorArgs.options) ? fieldConfig.editorArgs.options : [];
      options.unshift({label: "", value: ""});


      return new Select({
        name: fieldName,
        id: fieldName,
        options: options
      });

    }
  });
});
