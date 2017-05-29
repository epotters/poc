// EntityGrid
define([
  "dojo/_base/declare",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/extensions/ColumnResizer",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",

  "app/EntityStore",
  "app/EntityForm",
  "app/domain/personViewConfig",

  "dojo/domReady!"

], function (declare, OnDemandGrid, Selection, Editor, ColumnResizer, Button, Toolbar, domConstruct, EntityStore, EntityForm, personViewConfig) {


  console.log("Start building Entity Grid");
  var gridTargetId = "entity-grid";
  var entityType = personViewConfig.entityType;

  var entityGrid = new (declare([OnDemandGrid, Selection, ColumnResizer]))({
    collection: EntityStore,
    columns: personViewConfig.columns,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: "Loading " + entityType.labelPlural.toLocaleLowerCase() + "...",
    noDataMessage: "No " + entityType.labelPlural.toLocaleLowerCase() + " found."
  }, gridTargetId);



  entityGrid.on(".dgrid-row:click", function (evt) {
    evt.preventDefault();
    var row = entityGrid.row(evt);
  });



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
  });


  entityGrid.on("dgrid-refresh-complete", function (evt) {
    console.log("Refresh complete");
  });


  entityGrid.startup();

  console.log("Entity Grid ready");

  return entityGrid;
});
