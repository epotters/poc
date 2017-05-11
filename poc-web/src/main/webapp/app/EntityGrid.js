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

  console.log("Start building Entity Grid");

  var gridTargetId = "entity-grid";

  var entityGrid = new (declare([OnDemandGrid, Selection, ColumnResizer]))({
    collection: entityStore,
    columns: columns,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: loadingMessage,
    noDataMessage: noDataMessage
  }, gridTargetId);


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


  entityGrid.on("dgrid-row:contextmenu", function (evt) {
    evt.preventDefault(); // prevent default browser context menu
    var entity = entityGrid.row(evt).data;
    console.log("Right click on " + entityType.getDisplayName(entity));
  });

  entityGrid.on('dgrid-refresh-complete', function (evt) {
    console.log("Refresh complete");
  });


  function addToolbar() {
    var toolbar = new dijit.Toolbar({}, this.gridTargetId + "-toolbar");

    var addButton = new dijit.form.Button({
      label: "Add",
      onClick: function () {
        console.log("Create a new Entity");
      }
    });
    toolbar.addChild(addButton);

    var removeButton = new dijit.form.Button({
      label: "Remove",
      onClick: function () {
        // Confirm dialog
        console.log("Remove all selected entities");
        console.log(entityGrid.selection);
      }
    });
    toolbar.addChild(removeButton);

    var searchButton = new dijit.form.Button({
      label: "Search",
      onClick: function () {
        console.log("Show the search filter");
      }
    });
    toolbar.addChild(searchButton);
    toolbar.startup();
  }

  addToolbar();

  entityGrid.startup();

  console.log("Entity Grid ready");

  return entityGrid;
});
