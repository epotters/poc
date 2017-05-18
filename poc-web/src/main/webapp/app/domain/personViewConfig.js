/*
 personViewConfig
 */
define({
      entityType: {
        name: "person",
        namePlural: "people",
        label: "Person",
        labelPlural: "People",
        getDisplayName: function (person) {
          return person.firstName +
              ((!person.prefix || !person.prefix || person.prefix.length === 0) ? "" : " " + person.prefix) +
              " " + person.lastName
        }
      },
      columns: {
        firstName: "First Name",
        prefix: "",
        lastName: "Last Name",
        gender: {
          label: "Gender",
          get: function (person) {
            var genderOptions = {m: "Male", f: "Female"};
            return genderOptions[person.gender];
          }
        },
        dateOfBirth: {label: "Date of Birth"}
      }
    }
);
