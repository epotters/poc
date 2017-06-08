// EntityGrid
define([
  "dojo/_base/declare",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/extensions/ColumnResizer",
  "dojo/domReady!"
], function (declare, OnDemandGrid, Selection, Editor, ColumnResizer) {


  return declare([OnDemandGrid, Selection, Editor, ColumnResizer], {

    typeViewConfig: null,

    collection: null,
    columns: null,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: null,
    noDataMessage: null,
    sharedColumnSettings: {
      editOn: "dblclick",
      autoSave: true
    },


    constructor: function (params) {

      this.typeViewConfig = params.typeViewConfig;
      this.collection = params.store;

      this.columns = this.addSharedColumnSettings(this.typeViewConfig.columns, this.sharedColumnSettings);
      console.log(this.columns);

      console.log("Constructing an Entity Grid for " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase());

      this.loadingMessage = "Loading " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + "...";
      this.noDataMessage = "No " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + " found.";

      console.log("Ready constructing an Entity Grid");
    },

    postCreate: function () {
      this.inherited(arguments);

      var me = this;

      me.on(".dgrid-row:click", function (evt) {
        evt.preventDefault();
        var row = me.row(evt);
      });

      me.on("dgrid-select", function (evt) {
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Selected " + rows.length + " " + me.typeViewConfig.entityType.labelPlural.toLocaleLowerCase() + ":");
      });

      me.on("dgrid-deselect", function (evt) {
        evt.preventDefault();
        var rows = evt.rows;
        console.log("Deselected " + rows.length + " " + me.typeViewConfig.entityType.labelPlural.toLocaleLowerCase());
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
    },

    addSharedColumnSettings: function (columns, sharedSettings) {


      for (var key in columns) {

        if (!columns.hasOwnProperty(key)) {
          continue;
        }
        column = columns[key];

        for (var settingKey in sharedSettings) {
          if (!sharedSettings.hasOwnProperty(settingKey)) {
            continue;
          }
          column[settingKey] = sharedSettings[settingKey];
        }
        columns[key] = column;
      }
      return columns;
    }


  });
});
