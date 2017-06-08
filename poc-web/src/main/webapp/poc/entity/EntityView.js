// EntityView
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",

  "entity/EntityStore",
  "./EntityGrid",
  "./EntityForm",
  "./EntityGridToolbar",
  "./EntityFormToolbar",
  "./EntityMenu",

  "dojo/text!./templates/EntityView.html"


], function (declare, _WidgetBase, _TemplatedMixin,
    EntityStore, EntityGrid, EntityForm, EntityGridToolbar, EntityFormToolbar, EntityMenu, template) {

  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    typeViewConfig: null,

    entityStore: null,
    entityGrid: null,
    entityForm: null,
    entityGridToolbar: null,
    entityFormToolbar: null,
    entityMenu: null,

    constructor: function(params) {

      this.typeViewConfig = params.typeViewConfig;
      this.entityStore = new EntityStore({typeViewConfig: this.typeViewConfig});

      console.log("Constructing Entity View for " + this.typeViewConfig.entityType.labelPlural);

    },


    postCreate: function() {
      this.inherited(arguments);

      this.entityGrid = new EntityGrid({typeViewConfig: this.typeViewConfig, store: this.entityStore}, this.entityGridNode);
      this.entityForm = new EntityForm({typeViewConfig: this.typeViewConfig}, this.entityFormNode);
      this.entityGridToolbar = new EntityGridToolbar({grid: this.entityGrid}, this.entityGridToolbarNode);
      this.entityFormToolbar = new EntityFormToolbar({grid: this.entityForm}, this.entityFormToolbarNode);
      this.entityMenu = new EntityMenu({grid: this.entityGrid}, this.entityGrid.containerNode);

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
      console.log("Save " + this.typeViewConfig.entityType.label.toLocaleLowerCase());
    },


  });
});
