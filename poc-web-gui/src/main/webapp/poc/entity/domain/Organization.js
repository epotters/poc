Person = define([
      "dojo/_base/declare",
      "dmodel/Model"],
    function (declare, Model) {

      return declare(Model, {
        schema: {
          id: {
            type: "number"
          },
          name: {
            type: "string"
          },
          coc: {
            type: "string",
            required: true
          },
          legalForm: {
            type: "string"
          }
        }
      });

    }
);
