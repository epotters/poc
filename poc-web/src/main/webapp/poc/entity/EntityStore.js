// EntityStore
define([
  "dojo/_base/declare",
  "dojo/json",
  "dstore/Rest"
], function (declare, json, Rest) {

  return declare([Rest], {

    typeViewConfig: null,
    baseUrl: "http://dev.localhost/poc/api/",
    altLowercasePlural: null,


    constructor: function (params) {

      console.log("Constructing EntityStore");

      this.typeViewConfig = params.typeViewConfig;
      this.model = params.model;
      this.altLowercasePlural = this.typeViewConfig.entityType.name + "s";

      this.target = this.baseUrl + this.altLowercasePlural;

      this.postCreate();
    },


    parse: function (resultJson) {
      console.log("Parse results");
      results = json.parse(resultJson);

      var entities = [], totalCount = 0;

      if (results && results._embedded && results._embedded[this.altLowercasePlural]) {
        entities = results._embedded[this.altLowercasePlural];
        var entity, url, urlParts;

        for (var i = 0; i < entities.length; i++) {
          entity = entities[i];
          url = entity._links.self.href;
          urlParts = url.split("/");
          entity.id = urlParts[urlParts.length - 1];
          console.log(entity);
          entities[i] = entity;
        }

        totalCount = results.page.totalElements
      } else {

        console.log(results);
      }

      return {
        items: entities,
        totalCount: totalCount
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
