// BasePage

define([
  "dojo/_base/declare",
  "dojo/dom", "dojo/on",
  "dojo/request",
  "dojo/dom-form",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojomat/_AppAware",
  "./Navigation",
  "./LoginPanel",
  "./UserPanel",
  "dojo/text!./templates/BasePage.html"
], function (declare,
             dom, on,
             request, domForm,
             _WidgetBase,
             _TemplatedMixin,
             _AppAware,
             Navigation,
             LoginPanel,
             UserPanel,
             template) {

  return declare([_WidgetBase, _TemplatedMixin, _AppAware], {

    request: null,
    router: null,
    session: null,

    templateString: template,

    tokenUrl: "http://dev.localhost/poc/oauth/token",
    token: null,
    user: null,


    pageTitle: null,
    content: null,

    loginPanel: null,
    userPanel: null,

    constructor: function (params) {
      this.pageTitle = params.pageTitle;
      this.content = params.content;

      this.request = params.request;
      this.router = params.router;
      this.session = params.session;
    },

    postCreate: function () {
      this.inherited(arguments);

      var navigation = new Navigation({}, this.navigationNode);


      if (this.isLoggedIn()) {
        this.loadUser();
      } else {
        this.showLoginPanel();
      }

      this.setContent();
    },


    isLoggedIn: function () {
      return !!(this.token);
    },


    showLoginPanel: function () {
      var me = this;

      if (!this.loginPanel) {
        this.loginPanel = new LoginPanel({}, this.contentNode);
        var loginButton = dom.byId("loginButton");
        on(loginButton, "click", function (evt) {
          me.login();
        });
      } else {
        this.loginPanel.show();
      }
    },


    validateCredentials: function (username, password) {
      return (!!username && !!password);
    },

    login: function () {

      console.log("About to log in");

      var me = this;

      var username = domForm.fieldToObject("usernameField"),
          password = domForm.fieldToObject("passwordField");

      if (!this.validateCredentials(username, password)) {
        console.log("Username or password missing");
        // Mark fields
        return false;
      }

      var requestOptions = {
        method: "post",
        data: {
          username: username,
          password: password,
          grant_type: "password",
          scope: "read write"
        },
        headers: {
          Accept: "application/json",
          Authorization: "Basic cG9jOjk4NzY1NDMyMTA=" // poc:9876543210
        },
        handleAs: "json",
        timeout: 10000
      };

      console.log(requestOptions);


      request(this.tokenUrl, requestOptions).then(
          function (response) {
            console.log("The file's content is:");
            console.log(response);
            me.token = response["access_token"];
            console.log("Token: " + me.token);

            me.loginPanel.hideError();

            me.loadUser();
            me.loginPanel.hide();
          },
          function (error) {
            console.log("Login failed. An error occurred");
            // console.log(error);

            console.log("Status: " + error.response.status);
            console.log("Error: " + error.response.data.error);
            console.log("Error description: " + error.response.data.error_description);
            // Show Error on screen

            me.loginPanel.showError(error.response.data.error + "<br />" + error.response.data.error_description);

          }
      );

    },

    loadUser: function () {
      var me = this;
      require(["dojo/request"], function (request) {
        request("api/users/me", {
          headers: {
            Authorization: "Bearer " + me.token
          },
          handleAs: "json"
        }).then(
            function (user) {
              console.log(user);
              me.user = user;
              me.userPanel = new UserPanel({user: me.user}, me.userPanelNode);
            },
            function (error) {
              console.log("Error loading current user");
              console.log(error);
            }
        );
      });
    },

////

    setContent: function () {

    },


    setStyle: function () {

      var styleElement = window.document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      query("head")[0].appendChild(styleElement);

      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css; // IE
      } else {
        styleElement.innerHTML = css;
      }
    }


  });
});
