// EntityMenu
define([
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuItem",
  "app/EntityGrid",
  "dojo/domReady!"
], function (Menu, MenuItem, MenuSeparator, PopupMenuItem, EntityGrid) {

  console.log("Start building Entity Menu");

  contextMenu = new Menu({
    targetNodeIds: [EntityGrid.domNode]
  });

  contextMenu.addChild(new MenuItem({
    label: "Detail",
    onClick: function (evt) {
      var entity = EntityGrid.row(evt).data;
      console.log("Show detail voor ");
    }
  }));
  contextMenu.addChild(new MenuItem({
    label: "Edit",
    onClick: function (evt) {
      var entity = EntityGrid.row(evt).data;
      console.log("Edit ");
    }
  }));
  contextMenu.addChild(new MenuItem({
    label: "Delete",
    disabled: true,
    onClick: function (evt) {
      var entity = EntityGrid.row(evt).data;
      console.log("Delete ");
    }
  }));

  contextMenu.addChild(new MenuSeparator());

  var subMenu = new Menu();
  subMenu.addChild(new MenuItem({
    label: "Search for cell value",
    onClick: function (evt) {
      var entity = EntityGrid.row(evt).data;
      console.log("Search for cell value ");
    }
  }));
  subMenu.addChild(new MenuItem({
    label: "Exclude value from results",
    onClick: function (evt) {
      var entity = EntityGrid.row(evt).data;
      console.log("Exclude value from results ");
    }
  }));

  contextMenu.addChild(new PopupMenuItem({
    label: "Search",
    popup: subMenu
  }));


  contextMenu.startup();

  console.log("Entity Menu ready");

  return contextMenu;
});
