// BasePage
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/query",
  "./Navigation",
  "dojo/text!./templates/BasePage.html"
], function (declare,
             _WidgetBase,
             _TemplatedMixin,
             query,
             Navigation,
             template) {
  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,

    pageTitle: null,
    content: null,

    constructor: function (params) {

      this.pageTitle = params.pageTitle;
      this.content = params.content;

    },

    postCreate: function () {
      this.inherited(arguments);


      console.log("postCreate");

      console.log(this.navigationNode);

      var navigation = new Navigation({}, this.navigationNode);

      var title = "Base Page";

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
                  console.log("building an enitity view");
                  console.log(me.contentNode);
                  var entityView = new EntityView({typeViewConfig: typeViewConfig}, me.contentNode);
                  console.log(me.entityView);

                  console.log("done");
                });
          });
    },


    setStyle: function () {

      var styleElement = window.document.createElement('style');
      styleElement.setAttribute("type", "text/css");
      query('head')[0].appendChild(styleElement);

      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css; // IE
      } else {
        styleElement.innerHTML = css;
      }
    }


  });
});
