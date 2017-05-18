// EntityToolbar
define([
  "dojo/_base/declare",
  "dijit/form/Button",
  "dijit/Toolbar",
  "dojo/dom-construct",
  "app/EntityStore",
  "dojo/domReady!"

], function (declare, Button, Toolbar, domConstruct, EntityStore, personViewConfig) {

  var toolbar = new Toolbar({}, this.gridTargetId + "-toolbar");
  var addButton = new Button({
    label: "Add",
    onClick: function () {
      console.log("Create a new Entity");
    }
  });
  toolbar.addChild(addButton);

  var removeButton = new Button({
    label: "Remove",
    onClick: function () {
      // Confirm dialog
      console.log("Remove all selected entities");
      console.log(entityGrid.selection);
    }
  });
  toolbar.addChild(removeButton);

  var searchButton = new Button({
    label: "Search",
    onClick: function () {
      console.log("Show the search filter");
    }
  });
  toolbar.addChild(searchButton);
  toolbar.startup();

});

