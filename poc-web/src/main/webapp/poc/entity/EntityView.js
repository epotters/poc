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

    constructor: function(params) {

      this.typeViewConfig = params.typeViewConfig;
      this.store = new EntityStore({typeViewConfig: this.typeViewConfig});

      console.log("Constructing Entity View for " + this.typeViewConfig.entityType.labelPlural);
    },


    postCreate: function() {
      this.inherited(arguments);

      this.grid = new EntityGrid({typeViewConfig: this.typeViewConfig, store: this.store}, this.entityGridNode);
      this.form = new EntityForm({typeViewConfig: this.typeViewConfig}, this.entityFormNode);
      this.gridToolbar = new EntityGridToolbar({grid: this.grid}, this.entityGridToolbarNode);
      this.formToolbar = new EntityFormToolbar({grid: this.form}, this.entityFormToolbarNode);
      this.contextMenu = new EntityMenu({grid: this.grid}, this.grid.entityGridNode);

      this.activateEvents();
    },


    activateEvents: function() {

      var me = this;

      me.grid.on(".dgrid-row:click", function (evt) {
        evt.preventDefault();
        var entity = me.grid.row(evt).data;
        me.form.setValues(entity);
      });

      me.on("dgrid-select", function (evt) {
        evt.preventDefault();
        me.updateButtonState();
      });

      me.grid.on("dgrid-deselect", function (evt) {
        evt.preventDefault();
        me.updateButtonState();
      });

      me.grid.on(".dgrid-row:contextmenu", function (evt) {
        evt.preventDefault();
        var entity = me.grid.row(evt).data;
        console.log("Right click on " + me.typeViewConfig.entityType.getDisplayName(entity));

        this.contextMenu.show();
      });

      on(me.gridToolbar, "search", function(evt) {
        console.log("Toolbar emitted a search event");
      });

    },


    updateButtonState: function() {

      var selectedIds = Object.keys(this.grid.selection);
      console.log(selectedIds.length + " entities selected");

      if (selectedIds.length === 0) {
        console.log("Disable remove button");
        dojo.addClass(this.gridToolbar.removeButton.domNode, "disabled");
      } else {
        console.log("Enable remove button");
        dojo.removeClass(this.gridToolbar.removeButton.domNode, "disabled");
      }

    },




    addEntity: function (entity) {
      console.log("Add " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    updateEntity: function (entity) {
      console.log("Update " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    deleteEntity: function (entity) {
      console.log("Delete " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    saveEntity: function (entity) {
      console.log("Save " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },

    revertEntity: function (entity) {
      console.log("Revert " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    }


  });
});
