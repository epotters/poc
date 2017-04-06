
define([
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/CheckedMenuItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuItem",
  "dojo/domReady!"
], function (Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem) {

  console.log("Building contextual menu");

  contextMenu = new Menu({
    targetNodeIds: ["context-menu-button"]
  });


  contextMenu.addChild(new MenuItem({
    label: "Simple menu item"
  }));
  contextMenu.addChild(new MenuItem({
    label: "Disabled menu item",
    disabled: true
  }));
  contextMenu.addChild(new MenuItem({
    label: "Menu Item With an icon",
    iconClass: "dijitEditorIcon dijitEditorIconCut",
    onClick: function () {
      alert("I was clicked")
    }
  }));
  contextMenu.addChild(new CheckedMenuItem({
    label: "Checkable menu item"
  }));
  contextMenu.addChild(new MenuSeparator());

  var subMenu = new Menu();
  subMenu.addChild(new MenuItem({
    label: "Submenu item 1"
  }));
  subMenu.addChild(new MenuItem({
    label: "Submenu item 2"
  }));
  contextMenu.addChild(new PopupMenuItem({
    label: "Submenu",
    popup: subMenu
  }));

  contextMenu.startup();


  return contextMenu;
});
