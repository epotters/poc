// EntityView
define([
  "dojo/_base/declare",
  "app/EntityStore",
  "app/EntityGrid",
  "app/EntityForm",
  "app/EntityToolbar",
  "app/EntityMenu"
], function (declare, EntityStore, EntityGrid, EntityForm, EntityToolbar, EntityMenu) {

  return declare([], {

    typeViewConfig: null,

    entityStore: null,
    entityGrid: null,
    entityForm: null,
    entityToolbar: null,
    entityMenu: null,

    constructor: function(params) {

      this.typeViewConfig = params.typeViewConfig;
      console.log("Constructing Entity View for " + this.typeViewConfig.entityType.labelPlural.toLocaleLowerCase());

      this.entityStore = new EntityStore({dataUrl: "/poc-webapp/data/people.json"});


      this.entityGrid = new EntityGrid({typeViewConfig: this.typeViewConfig, store: this.entityStore}, "entity-grid");
      this.entityForm = new EntityForm({typeViewConfig: this.typeViewConfig}, "entity-form");
      this.entityToolbar = new EntityToolbar({grid: this.entityGrid}, "entity-toolbar");
      this.entityMenu = new EntityMenu({grid: this.entityGrid});
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
