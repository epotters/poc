// EntityStore
define([
  "dojo/_base/declare",
  "dstore/RequestMemory"
], function (declare, RequestMemory) {

  return declare([RequestMemory], {

    constructor: function (params) {
      console.log("Constructing EntityStore");
    },


    postCreate: function () {

      this.inherited(arguments);

      this.on("add", function (evt) {
        console.log("Entity added to EntityStore");
      });

      this.on("update", function (evt) {
        console.log("Entity updated in EntityStore");
      });

      this.on("delete", function (evt) {
        console.log("Entity deleted from EntityStore");
      });

    }

  });
});
