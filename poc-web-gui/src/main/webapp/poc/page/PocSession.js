// Session

define([
  "dojo/_base/declare"
], function (declare) {

  return declare([], {

    application: null,
    token: null,
    user: null,

    constructor: function (params) {
      this.application = params.application;
    },


    isLoggedIn: function () {
      return !!this.token;
    }

  });
});
