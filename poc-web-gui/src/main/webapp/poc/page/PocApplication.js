// Application

define([
  "dojo/_base/declare",
  "dojomat/Application",
  "dojomat/populateRouter",
  "./routing-map",
  "dojo/domReady!"
], function (declare,
             Application,
             populateRouter,
             routingMap) {

  return declare([Application], {

    displayName: "",
    name: "",
    version: "",

    session: null,

    constructor: function (params) {

      this.displayName = params.displayName;
      this.name = params.name;

      params.session = session;
      populateRouter(this, routingMap);
      this.run();
    }


  });
});
