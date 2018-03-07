// LoginPanel
define([
  "dojo/_base/declare",
  "dojo/on",
  "dojo/request",
  "dojo/dom-style",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/LoginPanel.html",
  "dojo/i18n!./nls/LoginPanel"
], function (declare,
             on,
             request,
             domStyle,
             _WidgetBase,
             _TemplatedMixin,
             template,
             nls) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,


    postCreate: function () {
      this.inherited(arguments);
      this.translateTexts();
    },

    translateTexts: function () {
      this.usernameLabel.innerHTML = nls.usernameLabel;
      this.passwordLabel.innerHTML = nls.passwordLabel;
      this.loginButton.innerHTML = nls.loginButton;
    },


    show: function () {
      domStyle.set(this.domNode, "display", "");
    },

    hide: function () {
      domStyle.set(this.domNode, "display", "none");
    },

    showError: function (errorText) {
      domStyle.set(this.errorText, "display", "");
      this.errorText.innerHTML = errorText;
    },

    hideError: function (errorText) {
      domStyle.set(this.errorText, "display", "none");
      this.errorText.innerHTML = "";
    }

  });
});
