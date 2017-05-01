


var entityType = {

  name: "person",
  namePlural: "people",
  label: "Person",
  labelPlural: "People",

  getDisplayName: function (person) {
    return person.firstName +
        ((!person.prefix || person.prefix.length === 0) ? "" : " " + person.prefix)
        + " " + person.lastName;
  }
};

var genderOptions = {m: "Male", f: "Female"};

var columns = {
      firstName: "First Name",
      prefix: "",
      lastName: "Last Name",
      gender: {
        label: "Gender",
        get: function (object) {
          return genderOptions[object.gender];
        }
      },
      dateOfBirth: {label: "Date of Birth"}
    },

    dataUrl = "data/people.json",
    loadingMessage = "Loading " + entityType.labelPlural.toLocaleLowerCase() + "...";
    noDataMessage = "No " + entityType.labelPlural.toLocaleLowerCase() + " found.";


var entityStore, entityGrid, entityForm, formDialog;


