// EntityStore
define([
  "dstore/RequestMemory"
], function (RequestMemory) {

  console.log("Loading EntityStore");

  var dataUrl = "data/people.json";

  var entityStore = new RequestMemory({
        idProperty: "id",
        // model: ;
        target: dataUrl}
    );

  entityStore.on("add", function(evt) {
    console.log("Entity added to EntityStore");
  });

  entityStore.on("update", function(evt) {
    console.log("Entity updated in EntityStore");
  });

  entityStore.on("delete", function(evt) {
    console.log("Entity deleted from EntityStore");
  });

  return entityStore;
});
