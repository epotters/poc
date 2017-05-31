// EntityToolbar
define([
  "dojo/_base/declare",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/domReady!"

], function (declare, Button, Toolbar, domConstruct) {
  return declare([Toolbar], {

  grid: null,

    constructor: function (params) {

      this.grid = params.grid;

    },

    postCreate: function () {

      this.inherited(arguments);

      var me = this;

      var addButton = new Button({
        label: "Add",
        onClick: function () {
          console.log("Create a new Entity");
        }
      });
      this.addChild(addButton);

      var removeButton = new Button({
        label: "Remove",
        onClick: function () {
          // Confirm dialog
          console.log("Remove all selected entities");
          console.log(me.grid.selection);
        }
      });
      this.addChild(removeButton);

      var searchButton = new Button({
        label: "Search",
        onClick: function () {
          console.log("Show the search filter");
        }
      });
      this.addChild(searchButton);
    }
  });

});
