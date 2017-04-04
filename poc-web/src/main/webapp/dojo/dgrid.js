// Data model


/*
 Person = define([
 "dojo/_base/declare",
 "dmodel/Model"],
 function (declare, Model) {

 return declare(Model, {
 schema: {
 id: {
 type: 'number'
 },
 firstName: {
 type: 'string'
 },
 prefix: {
 type: 'string'
 },
 lastName: {
 type: 'string',
 required: true
 },
 gender: {
 type: 'string'
 },
 dateOfBirth: {
 type: 'string'
 }
 }
 });
 });

 */


var entityType = {
  name: 'person',
  namePlural: 'people',
  label: 'Person',
  labelPlural: 'People',

  getDisplayName: function (person) {
    return person.firstName +
        ((!person.prefix || !person.prefix || person.prefix.length === 0) ? "" : " " + person.prefix) +
        " " + person.lastName
  }
};

var genderOptions = {m: "Male", f: "Female"};

var columns = {
      firstName: 'First Name',
      prefix: "",
      lastName: 'Last Name',
      gender: {
        label: 'Gender',
        get: function (object) {
          return genderOptions[object.gender];
        }
      },
      dateOfBirth: {label: 'Date of Birth'}
    },

    dataUrl = 'data/people.json',
    loadingMessage = 'Loading ' + entityType.labelPlural.toLocaleLowerCase() + '...',
    noDataMessage = 'No ' + entityType.labelPlural.toLocaleLowerCase() + ' found.';


var entityStore, entityGrid, entityForm, formDialog;

// Store
console.log("About to create a store");

require([
  'dstore/RequestMemory'
], function (RequestMemory) {
  entityStore = new RequestMemory({target: dataUrl});
});


/*

 // Form
 console.log("About to create a form");


 require([
 "dijit/Dialog",
 "dijit/form/Form",
 "dijit/form/TextBox",
 "dijit/form/Button",
 "dijit/layout/ContentPane",
 "dijit/layout/LayoutContainer",
 "dojo/dom-construct",
 "dojo/domReady!"
 ], function (Dialog, Form, TextBox, Button, ContentPane, LayoutContainer, domConstruct) {

 console.log("Creating an Editor Form");

 var formGroupType = 'div';



 function buildFormGroup(fieldName, fieldLabel) {
 var formGroup = domConstruct.create(formGroupType, {"class": "form-group"});
 domConstruct.create("label", {"for": fieldName, 'innerHTML': fieldLabel}, formGroup);
 new TextBox({
 name: fieldName,
 id: fieldName,
 placeHolder: fieldLabel
 }).placeAt(formGroup);
 return formGroup;
 }


 entityForm = new Form();

 var formGroup, fieldName, fieldLabel, fields = [];

 for (fieldName in columns) {
 if (columns.hasOwnProperty(fieldName)) {
 if (dojo.isObject(columns[fieldName])) {
 fieldLabel = columns[fieldName]["label"];
 } else {
 fieldLabel = columns[fieldName];
 }
 }
 formGroup = buildFormGroup(fieldName, fieldLabel);
 fields[fieldName] = formGroup;
 domConstruct.place(formGroup, entityForm.containerNode);

 }
 */

/*
 var layout = new LayoutContainer();

 var center = new ContentPane({region: 'center'});
 center.addChild(entityForm);


 var toolbar = new ContentPane({region: 'bottom'});
 var okButton = new Button({
 label: "OK"
 });

 toolbar.addChild(okButton);
 layout.addChild(center);
 layout.addChild(toolbar);
 */
/*
 formDialog = new Dialog({
 title: "Dialog with form",
 content: entityForm,
 class: "form-dialog"
 });


 entityForm.startup();

 });

 console.log("Form creation started");

 */









// Grid

console.log("About to create a grid");

require([
  'dojo/_base/declare',
  'dgrid/OnDemandGrid',
  'dgrid/Selection',
  "dgrid/Editor",
  'dgrid/extensions/ColumnResizer',
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, OnDemandGrid, Selection, ColumnResizer, Button, Toolbar, domConstruct) {

  entityGrid = new (declare([OnDemandGrid, Selection, ColumnResizer]))({
    collection: entityStore,
    columns: columns,
    selectionMode: 'extended',
    cellNavigation: false,
    loadingMessage: loadingMessage,
    noDataMessage: noDataMessage
  }, 'people-grid');

  entityGrid.on("dgrid-select", function (evt) {
    var rows = evt.rows;
    console.log("Selected " + entityType.labelPlural.toLocaleLowerCase() + ":");
    for (var i = 0; i < rows.length; i++) {
      console.log("\t\t" + entityType.getDisplayName(rows[i].data));
    }
  });

  entityGrid.on('dgrid-deselect', function (evt) {
    var rows = evt.rows;
    console.log("Deselected " + entityType.labelPlural.toLocaleLowerCase() + ":");

    for (var i = 0; i < rows.length; i++) {
      console.log("\t\t" + entityType.getDisplayName(rows[i].data));
    }
  });


  entityGrid.on('.dgrid-row:contextmenu', function (evt) {
    evt.preventDefault(); // prevent default browser context menu
    var entity = entityGrid.row(evt).data;
    console.log("Right click on " + entityType.getDisplayName(entity));

    // formDialog.set("title", entityType.getDisplayName(entity));
    // entityForm.setValues(entity);
    // formDialog.show();
  });


  /*

   var toolbar = new Toolbar({}, "people-grid-toolbar");

   var addButton = new Button({
   label: "Add",
   onClick: function () {
   console.log("Create a new Entity");
   }
   });
   toolbar.addChild(addButton);

   var removeButton = new Button({
   label: "Remove",
   onClick: function () {
   // Confirm dialog
   console.log("Remove all selected entities");
   console.log(entityGrid.selection);
   }
   }).startup();
   toolbar.addChild(removeButton);

   var searchButton = new Button({
   label: "Search",
   onClick: function () {
   console.log("Show the search filter");
   }
   }).startup();
   toolbar.addChild(searchButton);


   toolbar.startup();

   */


  entityGrid.startup();

  console.log("Grid ready");
});

console.log("Grid creation started");


//*
// Context Menu
var contextMenu;

require([
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/CheckedMenuItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuItem",
  "dojo/domReady!"
], function (Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem) {


  console.log("Building contextual menu");

  contextMenu = new Menu({
    targetNodeIds: ["context-menu-button"]
  });
  contextMenu.addChild(new MenuItem({
    label: "Simple menu item"
  }));
  contextMenu.addChild(new MenuItem({
    label: "Disabled menu item",
    disabled: true
  }));
  contextMenu.addChild(new MenuItem({
    label: "Menu Item With an icon",
    iconClass: "dijitEditorIcon dijitEditorIconCut",
    onClick: function () {
      alert('I was clicked')
    }
  }));
  contextMenu.addChild(new CheckedMenuItem({
    label: "Checkable menu item"
  }));
  contextMenu.addChild(new MenuSeparator());

  var subMenu = new Menu();
  subMenu.addChild(new MenuItem({
    label: "Submenu item 1"
  }));
  subMenu.addChild(new MenuItem({
    label: "Submenu item 2"
  }));
  contextMenu.addChild(new PopupMenuItem({
    label: "Submenu",
    popup: subMenu
  }));

  contextMenu.startup();
});

//*/


/*

 require(["dojo/dom",
 "dojo/on",
 "dojo/domReady!"],
 function (dom, on) {
 on(dom.byId("dialog-form-button"), "click", function () {
 console.log("Button clicked, opening dialog with form");
 formDialog.show();
 });
 });

 console.log("Creation started of test button to open the form");
 */
