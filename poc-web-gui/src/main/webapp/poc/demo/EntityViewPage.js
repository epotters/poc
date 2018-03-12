// EntityViewPage
define([
  "dojo/_base/declare",
  "page/BasePage"
], function (declare,
             BasePage) {
  return declare([BasePage], {

    entityView: null,

    constructor: function (params) {
    },

    postCreate: function () {
      this.inherited(arguments);
      this.title = "Entity page";
    },


    setContent: function () {

      var me = this;


      require([
            "dojo/io-query",
            "entity/EntityView"
          ],
          function (ioQuery, EntityView) {
            console.log("Creating entity view");
            var uri = location.href,
                query = uri.substring(uri.indexOf("?") + 1, uri.length),
                queryObject = ioQuery.queryToObject(query);

            var defaultTypeName = "person", defaultModelName = "Person";

            var typeName = (queryObject["type-name"]) ? queryObject["type-name"] : defaultTypeName;
            var modelName = (queryObject["model-name"]) ? queryObject["model-name"] : defaultModelName;
            console.log("Type name: \"" + typeName + "\", Model name: \"" + modelName + "\"");

            require([
                  "entity/domain/" + typeName + "ViewConfig",
                  "entity/domain/" + modelName
                ],
                function (typeViewConfig, model) {
                  me.entityView = new EntityView({typeViewConfig: typeViewConfig, model: model}, me.contentNode);
                });
          });
    }


  });
});
