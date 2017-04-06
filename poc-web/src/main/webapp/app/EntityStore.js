
define([
  "dstore/RequestMemory"
], function (RequestMemory) {

  console.log("Loading EntityStore");
  return new RequestMemory({target: dataUrl});
});
