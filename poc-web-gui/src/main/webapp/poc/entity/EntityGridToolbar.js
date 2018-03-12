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

    navbarLeft: null,
    navbarRight: null,

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

      this.navbarLeft = this.buildSubNavbar("navbar-left");
      this.navbarRight = this.buildSubNavbar("navbar-right");

      this.buildCrudButtons();
      this.buildViewButtons();
    },


    buildCrudButtons: function () {


      this.addButton = new Button({
        label: "Add",
        icon: "glyphicon-plus"
      });
      dojo.addClass(this.addButton.domNode, this.buttonClass);
      domConstruct.place(this.addButton.domNode, this.navbarRight);


      this.duplicateButton = new Button({
        label: "Duplicate",
        icon: "glyphicon-duplicate"
      });
      dojo.addClass(this.duplicateButton.domNode, this.buttonClass + " disabled");
      domConstruct.place(this.duplicateButton.domNode, this.navbarRight);


      this.removeButton = new Button({
        label: "Remove",
        icon: "glyphicon-trash"
      });
      dojo.addClass(this.removeButton.domNode, this.buttonClass + " disabled");
      domConstruct.place(this.removeButton.domNode, this.navbarRight);


      this.searchButton = new Button({
        label: "Search",
        icon: "glyphicon-search"
      });
      dojo.addClass(this.searchButton.domNode, this.buttonClass);
      domConstruct.place(this.searchButton.domNode, this.navbarRight);

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


      domConstruct.place(viewButtonGroup, this.navbarLeft);
    },

    buildSubNavbar: function (styleClass) {
      var subNavbar = domConstruct.create("div", {"class": "nav navbar-nav " + styleClass});
      domConstruct.place(subNavbar, this.domNode);
      return subNavbar;
    }
  });

});
