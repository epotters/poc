// EntityGrid
define([
  "dojo/_base/declare",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/extensions/ColumnResizer",
  "dojo/domReady!"
], function (declare, OnDemandGrid, Selection, Editor, ColumnResizer) {


  return declare([OnDemandGrid, Selection, ColumnResizer], {

    typeViewConfig: null,

    collection: null,
    columns: null,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: null,
    noDataMessage: null,


    constructor: function (params) {

      console.log("Constructing an Entity Grid");

      this.typeViewConfig = params.typeViewConfig;
      this.collection = params.store;

      this.columns = this.typeViewConfig.columns;

      this.loadingMessage = "Loading " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + "...";
      this.noDataMessage = "No " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + " found.";

      console.log("Ready constructing an Entity Grid");
    },

    postCreate: function () {
      this.inherited(arguments);

      this.on(".dgrid-row:click", function (evt) {
        evt.preventDefault();
        var row = this.row(evt);
      });

      this.on("dgrid-select", function (evt) {
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Selected " + entityType.labelPlural.toLocaleLowerCase() + ":");
        for (var i = 0; i < rows.length; i++) {
          console.log("\t\t" + this.typeViewConfig.entityType.getDisplayName(rows[i].data));
        }
      });

      this.on("dgrid-deselect", function (evt) {
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Deselected " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + ":");

        for (var i = 0; i < rows.length; i++) {
          console.log("\t\t" + this.typeViewConfig.entityType.getDisplayName(rows[i].data));
        }
      });

      this.on(".dgrid-row:contextmenu", function (evt) {
        evt.preventDefault();
        var entity = this.row(evt).data;
        console.log("Right click on " + this.typeViewConfig.entityType.getDisplayName(entity));
      });

      this.on("dgrid-refresh-complete", function () {
        console.log("Refresh complete");
      });

      console.log("Entity Grid ready");
    }
  })
});
