
define([
  "dojo/_base/declare",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/extensions/ColumnResizer",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, OnDemandGrid, Selection, ColumnResizer, Button, Toolbar, domConstruct) {


  var entityGrid = new (declare([OnDemandGrid, Selection, ColumnResizer]))({
    collection: entityStore,
    columns: columns,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: loadingMessage,
    noDataMessage: noDataMessage
  }, "entity-grid");


  entityGrid.on("dgrid-select", function (evt) {
    evt.preventDefault();
    var rows = evt.rows;
    console.log("Selected " + entityType.labelPlural.toLocaleLowerCase() + ":");
    for (var i = 0; i < rows.length; i++) {
      console.log("\t\t" + entityType.getDisplayName(rows[i].data));
    }
  });


  entityGrid.on("dgrid-deselect", function (evt) {
    evt.preventDefault();
    var rows = evt.rows;
    console.log("Deselected " + entityType.labelPlural.toLocaleLowerCase() + ":");

    for (var i = 0; i < rows.length; i++) {
      console.log("\t\t" + entityType.getDisplayName(rows[i].data));
    }
  });


  entityGrid.on(".dgrid-row:contextmenu", function (evt) {
    evt.preventDefault(); // prevent default browser context menu
    var entity = entityGrid.row(evt).data;
    console.log("Right click on " + entityType.getDisplayName(entity));

    // formDialog.set("title", entityType.getDisplayName(entity));
    // entityForm.setValues(entity);
    // formDialog.show();
  });


  function addToolbar() {
    var toolbar = new Toolbar({}, "people-grid-toolbar");

    var addButton = new Button({
      label: "Add",
      onClick: function () {
        console.log("Create a new Entity");
      }
    });
    toolbar.addChild(addButton)
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
  }
  // this.addToolbar();

  entityGrid.startup();

  console.log("Grid ready");

  return entityGrid;
});
