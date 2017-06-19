// EntityViewPage
define([
  "dojo/_base/declare",
  "page/BasePage"
], function (declare,
             BasePage
) {
  return declare([BasePage], {

    entityView: null,

    constructor: function (params) {
    },

    postCreate: function () {
      this.inherited(arguments);
      this.title = "Entity page";
      this.setContent();
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
            var defaultTypeName = "person";
            var typeName = (queryObject["type-name"]) ? queryObject["type-name"] : defaultTypeName;
            console.log("Type name: \"" + typeName + "\"");
            require(["entity/domain/" + typeName + "ViewConfig"],
                function (typeViewConfig) {
                  me.entityView = new EntityView({typeViewConfig: typeViewConfig}, me.contentNode);
                });
          });
    }


  });
});
