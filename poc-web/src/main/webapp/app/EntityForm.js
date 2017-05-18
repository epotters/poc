// EntityForm
define([
  "dijit/Dialog",
  "dijit/form/Form",
  "dijit/form/TextBox",
  "dijit/form/Button",
  "dijit/layout/ContentPane",
  "dijit/layout/LayoutContainer",
  "app/domain/personViewConfig",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (Dialog, Form, TextBox, Button, ContentPane, LayoutContainer, personViewConfig, domConstruct) {

  console.log("Start building Entity Form");

  var formGroupType = "div";

  function buildFormGroup(fieldName, fieldLabel) {
    var formGroup = domConstruct.create(formGroupType, {"class": "form-group"});
    domConstruct.create("label", {"for": fieldName, "innerHTML": fieldLabel}, formGroup);
    new TextBox({
      name: fieldName,
      id: fieldName,
      placeHolder: fieldLabel
    }).placeAt(formGroup);
    return formGroup;
  }

  function buildFormContainer(entityForm) {
    var layout = new LayoutContainer();
    var center = new ContentPane({region: "center"});
    center.addChild(entityForm);
    var toolbar = new ContentPane({region: "bottom"});


    var okButton = new Button({
      label: "OK"
    });
    toolbar.addChild(okButton);
    layout.addChild(center);
    layout.addChild(toolbar);

    return new Dialog({
      title: "Dialog with form",
      content: entityForm,
      class: "form-dialog"
    });
  }


  var entityForm = new Form();

  var formGroup, fieldName, fieldLabel, fields = [];
  var columns = personViewConfig.entityType.columns;

  for (fieldName in columns) {
    if (columns.hasOwnProperty(fieldName)) {
      if (dojo.isObject(columns[fieldName])) {
        fieldLabel = columns[fieldName]["label"];
      } else {
        fieldLabel = columns[fieldName];
      }
      formGroup = buildFormGroup(fieldName, fieldLabel);
      fields[fieldName] = formGroup;
      domConstruct.place(formGroup, entityForm.containerNode);
    }
  }

  entityForm.startup();
  console.log("Entity Form ready");

  return entityForm;
});
