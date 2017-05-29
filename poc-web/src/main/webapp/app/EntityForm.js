// EntityForm
define([
  "dijit/form/Form",
  "dijit/form/TextBox",
  "dijit/form/Button",

  "app/domain/personViewConfig",

  "dojo/dom-construct",
  "dojo/domReady!"
], function (Form, TextBox, Button, personViewConfig, domConstruct) {

  console.log("Start building Entity Form");

  var formGroupType = "div";

  var entityForm = new Form({}, "entity-form");


  var formGroup, fieldName, fieldLabel, fields = [];
  var columns = personViewConfig.columns;


  function buildFormGroup(fieldName, fieldLabel) {
    var formGroup = domConstruct.create(formGroupType, {"class": "form-group"});
    domConstruct.create("label", {"for": fieldName, "innerHTML": fieldLabel}, formGroup);
    new TextBox({
      name: fieldName,
      id: fieldName,
      placeHolder: fieldLabel
    }).placeAt(formGroup);

    console.log("\tFormGroup built for " + fieldName);
    return formGroup;
  }


  console.log("Next, we will add some fields to the form");
  console.log(personViewConfig.entityType);

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

      console.log("\tAdded field: " + fieldName);
    }
  }

  var okButton = new Button({
    label: "OK"
  });

  entityForm.startup();
  console.log("Entity Form ready");

  return entityForm;
});
