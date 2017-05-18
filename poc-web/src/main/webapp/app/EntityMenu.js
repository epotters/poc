// EntityMenu
define([
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuItem",
  "dojo/domReady!"
], function (Menu, MenuItem, MenuSeparator, PopupMenuItem) {

  console.log("Start building Entity Menu");

  contextMenu = new Menu({
    targetNodeIds: ["context-menu-button"]
  });

  contextMenu.addChild(new MenuItem({
    label: "Detail",
    iconClass: "dijitEditorIcon dijitEditorIconCut",
    onClick: function () {
      alert("I was clicked")
    }
  }));
  contextMenu.addChild(new MenuItem({
    label: "Edit"
  }));
  contextMenu.addChild(new MenuItem({
    label: "Delete",
    disabled: true
  }));

  contextMenu.addChild(new MenuSeparator());

  var subMenu = new Menu();
  subMenu.addChild(new MenuItem({
    label: "Search for cell value"
  }));
  subMenu.addChild(new MenuItem({
    label: "Exclude value from results"
  }));

  contextMenu.addChild(new PopupMenuItem({
    label: "Search",
    popup: subMenu
  }));


  contextMenu.startup();

  console.log("Entity Menu ready");

  return contextMenu;
});
