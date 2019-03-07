// EntityFormToolbar
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

    navbarLeft: null,
    navbarRight: null,

    saveButton: null,
    cancelButton: null,
    previousButton: null,
    nextButton: null,

    constructor: function (params) {

      this.grid = params.grid;

    },

    postCreate: function () {

      this.inherited(arguments);

      this.navbarLeft = this.buildSubNavbar("navbar-left");
      this.navbarRight = this.buildSubNavbar("navbar-right");

      this.buildNavigationButtons();
      this.buildSaveButtons();
    },


    buildSaveButtons: function () {
      var me = this;

      this.cancelButton = new Button({
        label: "Cancel",
        icon: "glyphicon-remove"
      });
      dojo.addClass(this.cancelButton.domNode, this.buttonClass);
      domConstruct.place(this.cancelButton.domNode, this.navbarRight);

      this.saveButton = new Button({
        label: "Save",
        icon: "glyphicon-ok"
      });
      dojo.addClass(this.saveButton.domNode, this.buttonClass);
      domConstruct.place(this.saveButton.domNode, this.navbarRight);
    },


    buildNavigationButtons: function () {

      var me = this;

      console.log("Start building the navigation button group");
      var navigationButtonGroup = domConstruct.create("div", {"class": "btn-group btn-group-sm", role: "group"});

      this.previousButton = new Button({
        label: "Previous",
        icon: "arrow-left"
      });
      dojo.addClass(this.previousButton.domNode, this.buttonClass);
      domConstruct.place(this.previousButton.domNode, navigationButtonGroup);

      this.nextButton = new Button({
        label: "Next",
        icon: "arrow-right"
      });
      dojo.addClass(this.nextButton.domNode, this.buttonClass);
      domConstruct.place(this.nextButton.domNode, navigationButtonGroup);

      domConstruct.place(navigationButtonGroup, this.navbarLeft);
    },


    buildSubNavbar: function (styleClass) {
      var subNavbar = domConstruct.create("div", {"class": "nav navbar-nav " + styleClass});
      domConstruct.place(subNavbar, this.domNode);
      return subNavbar;
    }
  });

});
