Person = define([
      "dojo/_base/declare",
      "dmodel/Model"],
    function (declare, Model) {

      return declare(Model, {
        schema: {
          id: {
            type: "number"
          },
          firstName: {
            type: "string"
          },
          prefix: {
            type: "string"
          },
          lastName: {
            type: "string",
            required: true
          },
          gender: {
            type: "string"
          },
          birthDate: {
            type: "string"
          },
          birthPlace: {
            type: "string"
          }
        }
      });

    }
);
