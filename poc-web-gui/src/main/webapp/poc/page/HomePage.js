// HomePage
define([
  "dojo/_base/declare",
  "page/BasePage"
], function (declare,
             BasePage) {
  return declare([BasePage], {

    constructor: function (params) {
    },

    postCreate: function () {
      this.inherited(arguments);
      this.title = "Demo Home page";
    },


    setContent: function () {

      var me = this;

      this.content = "<p>Demo content</p>";

    }


  });
});
