// NextPage
define([
  "dojo/_base/declare",
  "page/BasePage"
], function (declare, BasePage) {

  return declare([BasePage], {

    constructor: function (params) {
    },

    postCreate: function () {
      this.inherited(arguments);
      this.title = "Demo Next page";
    },
    
    setContent: function () {
      var me = this;
      this.content = "<p>Demo content next page</p>";
    }
  });
});
