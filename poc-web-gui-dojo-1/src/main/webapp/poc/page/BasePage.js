// BasePage

define([
  "dojo/_base/declare",
  "dojo/request",
  "dojo/cookie",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-class",
  "dojo/dom-form",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojomat/_AppAware",
  "./Navigation",
  "./LoginPanel",
  "./UserPanel",
  "dojo/text!./templates/BasePage.html"
], function (declare,
             request,
             cookie,
             on,
             dom,
             domClass,
             domForm,
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

    stickyHeader: true,
    shrinkHeaderOn: 60,

    templateString: template,

    tokenUrl: "http://dev.localhost/poc/oauth/token",
    tokenCookieName: "access_token",
    token: null,
    user: null,

    pageTitle: null,
    content: null,

    navigation: null,
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

      this.navigation = new Navigation({}, this.navigationNode);


      if (!this.isLoggedIn()) {
        console.log("About to load token from cookie");
        this.loadTokenFromStorage();
      }

      if (this.isLoggedIn()) {
        this.loadUser();
      } else {
        this.showLoginPanel();
      }

      this.setContent();

      if (this.stickyHeader) {
        this.addScrollListener();
      }
    },


    addScrollListener: function () {
      var me = this;
      window.addEventListener("scroll", function (evt) {
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            page = document.querySelector("#page");
        if (distanceY > me.shrinkHeaderOn) {
          domClass.add(page, "scrolling");
        } else {
          domClass.remove(page, "scrolling");
        }
      });
    },


    loadTokenFromStorage: function () {
      var token = cookie(this.tokenCookieName);
      if (token !== null && token !== undefined && token.length > 10) {
        this.token = token;
      } else {
        console.log("Token cookie is empty");
      }
    },

    storeTokenUntil: function (expiryDate) {
      cookie(this.tokenCookieName, this.token, {expires: expiryDate});
      console.log("Token stored in cookie");
    },


    isLoggedIn: function () {
      return (this.token !== null && this.token !== undefined);
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

      var me = this, username = domForm.fieldToObject("usernameField"),
          password = domForm.fieldToObject("passwordField");

      if (!this.validateCredentials(username, password)) {
        var msg = "Username, password or both are missing";
        this.loginPanel.showError(msg);
        return false;
      } else {
        this.loginPanel.hideError();
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


      request(this.tokenUrl, requestOptions).then(
          function (response) {
            console.log(response);
            me.token = response["access_token"];
            var tokenValidityInSec = response["expires_in"],
                expiryDate = me.calcultateExpiryDate(tokenValidityInSec);
            me.storeTokenUntil(expiryDate);
            console.log("Token: " + me.token);
            me.loginPanel.hideError();

            me.loadUser();
            me.loginPanel.hide();

            console.log("Logged in successfully");
          },
          function (error) {
            console.log("Login failed. An error occurred");
            console.log("Status: " + error.response.status);
            console.log("Error: " + error.response.data.error);
            console.log("Error description: " + error.response.data.error_description);
            me.loginPanel.showError(error.response.data.error + "<br />" + error.response.data.error_description);
            console.log("Failed to log in");
          }
      );
    },

    calcultateExpiryDate: function (tokenValidityInSec) {
      var buffer = 60, now = new Date(), time = now.getTime();
      time += parseInt(tokenValidityInSec - buffer) * 1000;
      now.setTime(time);
      return now.toUTCString();
    },


    logout: function () {
      console.log("Logging out");
      this.token = null;
      this.storeTokenUntil(-1);

      this.userPanel.hide();
      this.userPanel.user = null;
      this.user = null;

      this.showLoginPanel();
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

              if (!me.userPanel) {
                me.userPanel = new UserPanel({user: me.user}, me.userPanelNode);
                var logoutButton = dom.byId("logoutButton");
                on(logoutButton, "click", function (evt) {
                  me.logout();
                });
              }
              me.userPanel.show();

            },
            function (error) {
              console.log("Error loading current user");
              console.log(error);
            }
        );
      });
    },


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
