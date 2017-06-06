/*
 personViewConfig
 */
define({
      entityType: {
        name: "organization",
        namePlural: "organizations",
        label: "Organization",
        labelPlural: "Organizations",
        getDisplayName: function (organization) {
          return organization.name;
        }
      },
      columns: {
        name: "Name",
        coc: "Chamber of Commerce",
        legalForm: "Legal form"
      }
    }
);
