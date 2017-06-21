// EntityView
define([
  "dojo/_base/declare",
  "dojo/on",

  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",

  "./EntityStore",
  "./EntityGrid",
  "./EntityForm",
  "./EntityGridToolbar",
  "./EntityFormToolbar",
  "./EntityMenu",

  "dojo/text!./templates/EntityView.html"

], function (declare, on, _WidgetBase, _TemplatedMixin,
             EntityStore, EntityGrid, EntityForm, EntityGridToolbar, EntityFormToolbar, EntityMenu, template) {

  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    typeViewConfig: null,

    store: null,
    grid: null,
    form: null,
    gridToolbar: null,
    formToolbar: null,
    contextMenu: null,

    constructor: function (params) {

      this.typeViewConfig = params.typeViewConfig;
      this.store = new EntityStore({typeViewConfig: this.typeViewConfig});

      console.log("Constructing Entity View for " + this.typeViewConfig.entityType.labelPlural);
    },


    postCreate: function () {
      this.inherited(arguments);

      this.grid = new EntityGrid({typeViewConfig: this.typeViewConfig, store: this.store}, this.entityGridNode);
      this.form = new EntityForm({typeViewConfig: this.typeViewConfig}, this.entityFormNode);
      this.gridToolbar = new EntityGridToolbar({grid: this.grid}, this.entityGridToolbarNode);
      this.formToolbar = new EntityFormToolbar({grid: this.grid}, this.entityFormToolbarNode);
      this.contextMenu = new EntityMenu({grid: this.grid, targetIds: [this.grid.contentNode]});

      this.activateEvents();
    },


    activateEvents: function () {

      var me = this;

      me.grid.on(".dgrid-row:click", function (evt) {
        evt.preventDefault();
        var entity = me.grid.row(evt).data;
        me.form.setValues(entity);
      });

      me.grid.on("dgrid-select", function (evt) {
        evt.preventDefault();
        me.updateButtonState();
      });

      me.grid.on("dgrid-deselect", function (evt) {
        evt.preventDefault();
        me.updateButtonState();
      });

      /*
       me.grid.on(".dgrid-row:contextmenu", function (evt) {
       evt.preventDefault();
       var entity = me.grid.row(evt).data;
       console.log("Right click on " + me.typeViewConfig.entityType.getDisplayName(entity));

       me.contextMenu.open();
       });
       */

      // CRUD operations
     // me.gridToolbar.addButton.on("click", me.addEntity);

      on(this.gridToolbar.addButton, "click", function(evt) {me.addEntity(me);});
      on(this.gridToolbar.duplicateButton, "click", function(evt) {me.duplicateEntity(me);});
      on(this.gridToolbar.removeButton, "click", function(evt) {me.deleteEntity(me);});

      on(me.gridToolbar, "search", function (evt) {
        console.log("Toolbar emitted a search event");
      });


      // switch views when buttons are clicked
      me.gridToolbar.tableViewButton.on("click", me.grid.setViewRenderer("table"));
      me.gridToolbar.detailViewButton.on("click", me.grid.setViewRenderer("details"));
      me.gridToolbar.galleryViewButton.on("click", me.grid.setViewRenderer("gallery"));

    },


    updateButtonState: function () {

      var selectedIds = Object.keys(this.grid.selection);
      console.log(selectedIds.length + " entities selected");

      if (selectedIds.length === 0) {
        console.log("Disable buttons that rely on a selection");
        dojo.addClass(this.gridToolbar.removeButton.domNode, "disabled");
        dojo.addClass(this.gridToolbar.duplicateButton.domNode, "disabled");
      } else {
        console.log("Enable buttons that rely on a selection");
        dojo.removeClass(this.gridToolbar.removeButton.domNode, "disabled");
        dojo.removeClass(this.gridToolbar.duplicateButton.domNode, "disabled");
      }

    },


    addEntity: function (me) {
      console.log("Add " + me.typeViewConfig.entityType.label.toLocaleLowerCase());
      this.grid.store.add(me.typeViewConfig.newEntity);
      this.grid.refresh();
    },

    updateEntity: function (entity) {
      console.log("Update " + me.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    duplicateEntity: function () {
      console.log("Duplicate this " + this.typeViewConfig.entityType.label.toLocaleLowerCase());

      var entity, newEntity, keys = this.collectKeys(this.grid.selection), firstKey, entityKeys, entityKey;

      if (keys.length > 0) {
        firstKey = keys[0];
        entity = this.grid.selection[firstKey];
        entityKeys = this.collectKeys(entity);
        newEntity = {};
        for (var i = 0; i < entityKeys.length; i++) {
          entityKey = entityKeys[i];
          if (entityKey !== "id") {
            newEntity[entityKey] = entity[entityKey];
          }
        }
        this.grid.store.add(newEntity);
        this.grid.refresh();
      }
    },

    deleteEntity: function () {
      console.log("Delete this " + this.typeViewConfig.entityType.label.toLocaleLowerCase());

      var keys = this.collectKeys(this.grid.selection);
      numberSelected = keys.length;
      console.log(this.grid.selection);

      if (numberSelected > 0) {
        console.log("Remove all selected entities");
        var entity;
        for (var i = 0; i < keys.length; i++) {
          this.grid.collection.remove(keys[i]);
        }
        this.grid.refresh();
      } else {
        console.log("No entities selected");
      }
    },

    saveEntity: function (entity) {
      console.log("Save " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    revertEntity: function (entity) {
      console.log("Revert " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    selectNextEntity: function (entity) {
      console.log("Select next " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    selectPreviousEntity: function (entity) {
      console.log("Select previous " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    }


  });
});
