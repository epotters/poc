define([
  "dojo/_base/config",
  "require"
], function (config, require) {
  var p = config["routing-map"].pathPrefix;
  return {
    home: {
      schema: p + "/",
      widget: require.toAbsMid("./HomePage")
    },
    next: {
      schema: p + "/next",
      widget: require.toAbsMid("./NextPage")
    }
  };
});
