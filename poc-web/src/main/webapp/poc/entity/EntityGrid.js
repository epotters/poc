// EntityGrid
define([
  "dojo/_base/declare",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/Keyboard",
  "dgrid/extensions/ColumnResizer",
  "dojo/domReady!"
], function (declare, OnDemandGrid, Selection, Editor, Keyboard, ColumnResizer) {


  return declare([OnDemandGrid, Selection, Editor, Keyboard, ColumnResizer], {

    typeViewConfig: null,

    collection: null,
    columns: null,
    selectionMode: "extended",
    cellNavigation: false,
    loadingMessage: null,
    noDataMessage: null,
    sharedColumnSettings: {
      // editOn: "dblclick",
      autoSave: true

      , renderCell: function (entity, value, cellNode) {
        var div = document.createElement("div");
        div.className = "display-field";
        div.innerHTML = value;
        return div;
      }
    },


    constructor: function (params) {

      this.typeViewConfig = params.typeViewConfig;
      this.collection = params.store;

      this.columns = this.addSharedColumnSettings(this.typeViewConfig.columns, this.sharedColumnSettings);
      console.log(this.columns);


      var labelPlural = this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase();
      console.log("Constructing an Entity Grid for " + labelPlural);
      this.loadingMessage = "Loading " + labelPlural + "...";
      this.noDataMessage = "No " + labelPlural + " found.";

      console.log("Ready constructing an Entity Grid");
    },


    postCreate: function () {
      this.inherited(arguments);

      dojo.addClass(this.domNode, "table");

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
        console.log("\tkey: " + key);
        column = columns[key];
        for (var settingKey in sharedSettings) {
          if (!sharedSettings.hasOwnProperty(settingKey)) {
            continue;
          }
          console.log("\t\t" + settingKey);
          column[settingKey] = sharedSettings[settingKey];
        }
        columns[key] = column;
      }
      return columns;
    }

  });
});
