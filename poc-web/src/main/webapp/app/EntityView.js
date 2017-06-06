// EntityView
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",

  "app/EntityStore",
  "app/EntityGrid",
  "app/EntityForm",
  "app/EntityToolbar",
  "app/EntityMenu",

  "dojo/text!./templates/EntityView.html"


], function (declare, _WidgetBase, _TemplatedMixin,
    EntityStore, EntityGrid, EntityForm, EntityToolbar, EntityMenu, template) {

  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    typeViewConfig: null,

    entityStore: null,
    entityGrid: null,
    entityForm: null,
    entityToolbar: null,
    entityMenu: null,

    constructor: function(params) {

      this.typeViewConfig = params.typeViewConfig;
      this.entityStore = new EntityStore({typeViewConfig: this.typeViewConfig});

      console.log("Constructing Entity View for " + this.typeViewConfig.entityType.labelPlural);

    },


    postCreate: function() {
      this.inherited(arguments);

      console.log("postCreate EntityView");


      this.entityGrid = new EntityGrid({typeViewConfig: this.typeViewConfig, store: this.entityStore}, this.entityGridNode);
      this.entityForm = new EntityForm({typeViewConfig: this.typeViewConfig}, this.entityFormNode);

      this.entityToolbar = new EntityToolbar({grid: this.entityGrid}, this.entityToolbarNode);
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
    }
  });
});
