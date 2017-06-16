// BasePage
define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "./Navigation",
  "./UserPanel",
  "dojo/text!./templates/BasePage.html"
], function (declare,
             _WidgetBase,
             _TemplatedMixin,
             Navigation,
             UserPanel,
             template) {
  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,

    user: null,

    pageTitle: null,
    content: null,

    constructor: function (params) {
      this.pageTitle = params.pageTitle;
      this.content = params.content;
    },

    postCreate: function () {
      this.inherited(arguments);

      var navigation = new Navigation({}, this.navigationNode);

      var me = this;
      require(["dojo/request"], function (request) {
        request("data/user.json", {handleAs: "json"}).then(
            function (user) {
              console.log(user);
              me.user = user;
              var userPanel = new UserPanel({user: me.user}, me.userPanelNode);
            },
            function (error) {
              console.log("Error loading current user");
              console.log(error);
            }
        );
      });


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
                  var entityView = new EntityView({typeViewConfig: typeViewConfig}, me.contentNode);
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
