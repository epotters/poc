// EntityGrid
define([
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/Editor",
  "dgrid/Keyboard",
  "dgrid/extensions/ColumnResizer",
  "dojo/domReady!"
], function (declare, domConstruct, domClass, OnDemandGrid, Selection, Editor, Keyboard, ColumnResizer) {


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
    },

    renderers: {
      table: OnDemandGrid.prototype.renderRow,
      details: function (entity) {
        entity.displayName = entity.firstName + " " + ((entity.prefix) ? entity.prefix : "") + " " + entity.lastName;
        entity.summary = "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo." +
            " Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.";
        return domConstruct.create("div", {
          class: "media",
          innerHTML: "<div class=\"media-left\"><div class=\"icon\">&nbsp;</div></div>" +
          "<div class=\"media-body\">" +
          "<h4 class=\"media-heading\">"  + entity.displayName + "</h4>" +
          "<p>" + entity.summary + "</p>" +
          "</div>"
        });
      },
      gallery: function (entity) {
        entity.displayName = entity.firstName + " " + ((entity.prefix) ? entity.prefix : "") + " " + entity.lastName;
        return domConstruct.create("div", {
          class: "media",
          innerHTML: "<div class=\"media-left\"></div><div class=\"icon\">&nbsp;</div></div>" +
          "<div class=\"name\">" + entity.displayName + "</div>"
        });
      }
    },


    setViewRenderer: function (viewName) {

      var me = this;

      return function () {
        console.log("Switching to " + viewName + "-view");
        me.renderRow = me.renderers[viewName];
        domClass.replace(me.domNode, viewName, "table gallery details");
        me.set("showHeader", viewName === "table");
        me.refresh();
      };

    }

  });
});
