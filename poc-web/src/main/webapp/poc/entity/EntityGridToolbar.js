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
    removeButton: null,
    searchButton: null,

    constructor: function (params) {
      this.grid = params.grid;
    },

    collectKeys: function (object) {
      var keys = [];
      for (var key in object) {
        if (!object.hasOwnProperty(key)) {
          continue;
        }
        keys.push(key);
      }
      return keys;
    },


    postCreate: function () {

      this.inherited(arguments);


      this.buildCrudButtons();
      this.buildViewButtons();
    },


    buildCrudButtons: function () {

      var me = this;


      var newEntity = {
        id: "20001",
        firstName: "Milan",
        prefix: "",
        lastName: "Potters",
        gender: "m",
        dateOfBirth: "2003-11-26"
      };

      this.addButton = new Button({
        label: "Add",
        icon: "glyphicon-plus",
        onClick: function () {
          console.log("Create a new Entity");
          on.emit(this, "add", {});
          me.grid.store.add(newEntity);
          me.grid.refresh();
        }
      });
      dojo.addClass(this.addButton.domNode, this.buttonClass);
      this.addChild(this.addButton);


      this.removeButton = new Button({
        label: "Remove",
        icon: "glyphicon-trash",
        onClick: function () {

          on.emit(this, "remove", {});

          var keys = me.collectKeys(me.grid.selection);
          console.log(keys);
          numberSelected = keys.length;
          console.log(me.grid.selection);

          if (numberSelected > 0) {
            console.log("Remove all selected entities");
            var entity;
            for (var i = 0; i < keys.length; i++) {
              me.grid.collection.remove(keys[i]);
            }
            me.grid.refresh();

          } else {
            console.log("No entities selected");
          }
        }
      });
      dojo.addClass(this.removeButton.domNode, this.buttonClass + " disabled");
      this.addChild(this.removeButton);


      this.searchButton = new Button({
        label: "Search",
        icon: "glyphicon-search",
        onClick: function () {
          console.log("Show the search filter");
          on.emit(this, "search", {});
        }
      });
      dojo.addClass(this.searchButton.domNode, this.buttonClass);
      this.addChild(this.searchButton);

    },


    buildViewButtons: function () {

      var me = this;


      console.log("Start building the view button group");
      var viewButtonGroup = domConstruct.create("div", {"class": "btn-group btn-group-sm", role: "group"});

      var tableViewButton = new Button({
        label: "Table",
        icon: "glyphicon-align-justify",
        onClick: function () {
          console.log("Show as Table");
          on.emit(this, "tableView", {});
        }
      });
      dojo.addClass(tableViewButton.domNode, this.buttonClass);
      domConstruct.place(tableViewButton.domNode, viewButtonGroup);
      console.log("Button added to the view button group");


      var detailViewButton = new Button({
        label: "Detail",
        icon: "glyphicon-th-list", // "glyphicon-list"
        onClick: function () {
          console.log("Show as Detail");
          this.emit("detailView", {});
        }
      });
      dojo.addClass(detailViewButton.domNode, this.buttonClass);
      domConstruct.place(detailViewButton.domNode, viewButtonGroup);


      var galleryViewButton = new Button({
        label: "Gallery",
        icon: "glyphicon-th",
        onClick: function () {
          console.log("Show as Gallery");
          this.emit("galleryView", {});
        }
      });
      dojo.addClass(galleryViewButton.domNode, this.buttonClass);
      domConstruct.place(galleryViewButton.domNode, viewButtonGroup);


      // switch views when buttons are clicked
      on(tableViewButton, "click", me.grid.setViewRenderer("table"));
      on(detailViewButton, "click", me.grid.setViewRenderer("details"));
      on(galleryViewButton, "click", me.grid.setViewRenderer("gallery"));


      domConstruct.place(viewButtonGroup, this.domNode);
    }
  });

});
