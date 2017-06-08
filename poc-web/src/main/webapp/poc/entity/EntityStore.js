// EntityStore
define([
  "dojo/_base/declare",
  "dstore/RequestMemory"
], function (declare, RequestMemory) {

  return declare([RequestMemory], {

    typeViewConfig: null,

    constructor: function (params) {
      console.log("Constructing EntityStore");
      this.typeViewConfig = params.typeViewConfig;
      this.target = "data/" + this.typeViewConfig.entityType.namePlural + ".json";
      this.postCreate();
    },


    postCreate: function () {

      console.log("PostCreate EntityStore");

      this.inherited(arguments);

      this.on("add", function (evt) {
        console.log(this.typeViewConfig.entityType.label + " added");
      });

      this.on("update", function (evt) {
        console.log(this.typeViewConfig.entityType.label + " updated");
      });

      this.on("delete", function (evt) {
        console.log(this.typeViewConfig.entityType.label + " deleted");
      });

    }

  });
});
