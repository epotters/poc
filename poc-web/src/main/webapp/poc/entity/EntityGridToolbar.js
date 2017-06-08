// EntityGridToolbar
define([
  "dojo/_base/declare",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/domReady!"
], function (declare, Button, Toolbar, domConstruct) {
  return declare([Toolbar], {

    grid: null,
    buttonClass: "btn btn-sm btn-default",

    constructor: function (params) {
      this.grid = params.grid;
    },

    postCreate: function () {

      this.inherited(arguments);

      var me = this;

      var addButton = new Button({
        label: "Add",
        icon: "glyphicon-plus",
        onClick: function () {
          console.log("Create a new Entity");
        }
      });
      dojo.addClass(addButton.domNode, this.buttonClass);
      this.addChild(addButton);

      var removeButton = new Button({
        label: "Remove",
        icon: "glyphicon-trash",
        onClick: function () {
          // Confirm dialog
          var numberSelected = me.grid.selection.length;
          if (numberSelected > 0) {
            console.log("Remove all selected entities");
            console.log(me.grid.selection);
          } else {
            console.log("No entities selected");
          }
        }
      });
      dojo.addClass(removeButton.domNode, this.buttonClass);
      this.addChild(removeButton);

      var searchButton = new Button({
        label: "Search",
        icon: "glyphicon-search",
        onClick: function () {
          console.log("Show the search filter");
        }
      });
      dojo.addClass(searchButton.domNode, this.buttonClass);
      this.addChild(searchButton);


      console.log("Start building the view button group");
      var viewButtonGroup = domConstruct.create("div", {"class": "btn-group btn-group-sm", role: "group"});

      var tableViewButton = new Button({
        label: "Table",
        icon: "glyphicon-search",
        onClick: function () {
          console.log("Show as Table");
        }
      });
      dojo.addClass(tableViewButton.domNode, this.buttonClass);
      domConstruct.place(tableViewButton.domNode, viewButtonGroup);
      console.log("Button added to the view button group");


      var detailViewButton = new Button({
        label: "Detail",
        icon: "glyphicon-search",
        onClick: function () {
          console.log("Show as Detail");
        }
      });
      dojo.addClass(detailViewButton.domNode, this.buttonClass);
      domConstruct.place(detailViewButton.domNode, viewButtonGroup);


      var galleryViewButton = new Button({
        label: "Gallery",
        icon: "glyphicon-search",
        onClick: function () {
          console.log("Show as Gallery");
        }
      });
      dojo.addClass(galleryViewButton.domNode, this.buttonClass);
      domConstruct.place(galleryViewButton.domNode, viewButtonGroup);


      domConstruct.place(viewButtonGroup, this.domNode);
    }
  });

});
