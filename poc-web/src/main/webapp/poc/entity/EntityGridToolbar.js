// EntityGridToolbar
define([
  "dojo/_base/declare",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/on",
  "dojo/domReady!"
], function (declare, Button, Toolbar, domConstruct, domClass, on) {

  return declare([Toolbar], {

    grid: null,
    buttonClass: "btn btn-sm btn-default",

    addButton: null,
    duplicateButton: null,
    removeButton: null,
    searchButton: null,

    galleryViewButton: null,
    detailViewButton: null,
    tableViewButton: null,

  constructor: function (params) {
      this.grid = params.grid;
    },


    postCreate: function () {
      this.inherited(arguments);

      dojo.addClass(this.domNode, "toolbar");

      this.buildCrudButtons();
      this.buildViewButtons();
    },


    buildCrudButtons: function () {


      this.addButton = new Button({
        label: "Add",
        icon: "glyphicon-plus"
      });
      dojo.addClass(this.addButton.domNode, this.buttonClass);
      this.addChild(this.addButton);


      this.duplicateButton = new Button({
        label: "Duplicate",
        icon: "glyphicon-duplicate"
      });
      dojo.addClass(this.duplicateButton.domNode, this.buttonClass + " disabled");
      this.addChild(this.duplicateButton);


      this.removeButton = new Button({
        label: "Remove",
        icon: "glyphicon-trash"
      });
      dojo.addClass(this.removeButton.domNode, this.buttonClass + " disabled");
      this.addChild(this.removeButton);


      this.searchButton = new Button({
        label: "Search",
        icon: "glyphicon-search"
      });
      dojo.addClass(this.searchButton.domNode, this.buttonClass);
      this.addChild(this.searchButton);

    },


    buildViewButtons: function () {

      var me = this;

      console.log("Start building the view button group");
      var viewButtonGroup = domConstruct.create("div", {"class": "btn-group btn-group-sm", role: "group"});


      this.tableViewButton = new Button({
        label: "Table",
        icon: "glyphicon-align-justify"
      });
      dojo.addClass(this.tableViewButton.domNode, this.buttonClass);
      domConstruct.place(this.tableViewButton.domNode, viewButtonGroup);
      console.log("Button added to the view button group");


      this.detailViewButton = new Button({
        label: "Detail",
        icon: "glyphicon-th-list"
      });
      dojo.addClass(this.detailViewButton.domNode, this.buttonClass);
      domConstruct.place(this.detailViewButton.domNode, viewButtonGroup);


      this.galleryViewButton = new Button({
        label: "Gallery",
        icon: "glyphicon-th"
      });
      dojo.addClass(this.galleryViewButton.domNode, this.buttonClass);
      domConstruct.place(this.galleryViewButton.domNode, viewButtonGroup);


      domConstruct.place(viewButtonGroup, this.domNode);
    }

  });

});
