// EntityStore
define([
  "dojo/_base/declare",
  "dojo/json",
  "dstore/Rest"
], function (declare, json, Rest) {

  console.log(Rest);

  return declare([Rest], {

    typeViewConfig: null,
    baseUrl: "http://dev.localhost/poc/api/",
    altLowercasePlural: null,


    constructor: function (params) {

      console.log("Constructing EntityStore");
      this.altLowercasePlural = this.typeViewConfig.entityType.name + "s";
      this.typeViewConfig = params.typeViewConfig;
      this.target = this.baseUrl + this.altLowercasePlural;

      this.postCreate();
    },



    parse: function (resultJson) {
      console.log("Parse results");
      results = json.parse(resultJson);

      return {
        items: results._embedded.persons,
        totalCount: results.page.totalElements
      };
    },


    postCreate: function () {

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
