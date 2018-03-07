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
              " " + person.lastName;
        }
      },
      newEntity: {
        id: "",
        firstName: "",
        prefix: "",
        lastName: "",
        gender: "",
        birthDate: "",
        birthPlace: ""
      },
      columns: {
        firstName: {
          label: "First Name",
          editor: "text"
        },
        prefix: {
          label: "",
          editor: "text"
        },
        lastName: {
          label: "Last Name",
          editor: "text"
        },
        gender: {
          label: "Gender",
          renderCell: function (person, value, cellNode) {
            var div = document.createElement("div");
            div.className = "display-field";
            div.innerHTML = value;
            return div;
          },
          editor: "Select",
          editorArgs: {
            options: [
              {label: "Female", value: "FEMALE"},
              {label: "Male", value: "MALE"}
            ]
          },

          get: function (person) {
            var label = "", options = this.editorArgs.options, option;
            for (var i = 0; i < options.length; i++) {
              option = options[i];
              if (option.value === person.gender) {
                label = option.label;
                break;
              }
            }
            return label;
          }
        },
        birthDate: {
          label: "Date of Birth",
          editor: "DateTextBox"
        },
        birthPlace: {
          label: "Birth place",
          editor: "text"
        },
      }
    }
);
