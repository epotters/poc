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

      this.typeViewConfig = params.typeViewConfig;
      this.collection = params.store;
      this.columns = this.typeViewConfig.columns;

      console.log("Constructing an Entity Grid for " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase());


      this.loadingMessage = "Loading " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + "...";
      this.noDataMessage = "No " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + " found.";

      console.log("Ready constructing an Entity Grid");
    },

    postCreate: function () {
      this.inherited(arguments);

      var me = this;

      me.on(".dgrid-row:click", function (evt) {
        console.log(me);
        evt.preventDefault();
        var row = me.row(evt);
      });

      me.on("dgrid-select", function (evt) {
        console.log(me);
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Selected " + me.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + ":");
        for (var i = 0; i < rows.length; i++) {
          console.log("\t\t" + me.typeViewConfig.entityType.getDisplayName(rows[i].data));
        }
      });

      me.on("dgrid-deselect", function (evt) {

        console.log(me);
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Deselected " + me.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + ":");

        for (var i = 0; i < rows.length; i++) {
          console.log("\t\t" + me.typeViewConfig.entityType.getDisplayName(rows[i].data));
        }
      });

      me.on(".dgrid-row:contextmenu", function (evt) {
        evt.preventDefault();
        var entity = me.row(evt).data;
        console.log("Right click on " + me.typeViewConfig.entityType.getDisplayName(entity));
      });

      me.on("dgrid-refresh-complete", function () {
        console.log("Refresh complete");
      });

      console.log("Entity Grid ready");
    }
  })
});
