// EntityMenu
define([
  "dojo/_base/declare",
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuItem",
  "dojo/domReady!"
], function (declare, Menu, MenuItem, MenuSeparator, PopupMenuItem) {

  return declare([Menu], {

    grid: null,

    constructor: function (params) {
      console.log("Constructing Entity Menu");
      this.grid = params.grid;
    },

    postCreate: function () {

      this.inherited(arguments);

      this.addItems();

      dojo.addClass(this.domNode, "dropdown-menu");

      console.log("Entity Menu ready");
    },


    addItems: function () {

      this.addChild(new MenuItem({
        label: "Detail",
        onClick: function (evt) {
          console.log("Show detail voor ");
        }
      }));

      this.addChild(new MenuItem({
        label: "Edit",
        onClick: function (evt) {
          console.log("Edit ");
        }
      }));

      this.addChild(new MenuItem({
        label: "Delete",
        disabled: true,
        onClick: function (evt) {
          console.log("Delete ");
        }
      }));

      this.addChild(new MenuSeparator());

      var subMenu = new Menu();
      subMenu.addChild(new MenuItem({
        label: "Search for cell value",
        onClick: function (evt) {
          var entity = this.grid.row(evt).data;
          console.log("Search for cell value ");
        }
      }));

      subMenu.addChild(new MenuItem({
        label: "Exclude value from results",
        onClick: function (evt) {
          console.log("Exclude value from results ");
        }
      }));

      this.addChild(new PopupMenuItem({
        label: "Search",
        popup: subMenu
      }));
    }
  });
});
