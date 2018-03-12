// define choices of component type which will be available in form
var componentTypes = [
  // native input types
  {label: "text", generate: generateText},
  {label: "checkbox", generate: generateBool},
  {label: "radio", generate: generateBoolRadio},
  {
    label: "textarea",
    generate: generateText,
    column: {editorArgs: {rows: 3}}
  },
  // TODO: support select?
  // Dijits
  {label: "dijit/form/TextBox", generate: generateText},
  {label: "dijit/form/SimpleTextarea", generate: generateText},
  {
    label: "dijit/form/CheckBox",
    generate: generateBool,
    // Dijit's CheckBox is a bit special, in that value reports
    // a string value if checked, but false if unchecked.
    column: {
      editorArgs: {value: "enabled"},
      get: function (item) {
        // ensure initial rendering matches up with widget behavior
        return item.editor ? "enabled" : false;
      },
      set: function (item) {
        // convert to boolean for save
        return !!item.editor;
      }
    }
  },
  {
    label: "dijit/form/ValidationTextBox",
    generate: generateText,
    column: {editorArgs: {required: true}}
  },
  {
    label: "dijit/form/NumberSpinner",
    generate: generateNumber,
    column: {editorArgs: {constraints: {min: 0}}}
  },
  {
    label: "dijit/form/DateTextBox",
    generate: generateDate,
    renderCell: function (object, value) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(value ? value.toString() : "No Date"));
      return div;
    }
  },
  {
    label: "dijit/form/HorizontalSlider",
    generate: generateNumber,
    column: {editorArgs: {minimum: 0, maximum: 1000}}
  },
  {
    label: "dijit/form/FilteringSelect",
    generate: generateOptionValue,
    column: {editorArgs: {store: optionsStore}}
  },
  {
    label: "dijit/form/Select",
    generate: generateOptionValue,
    column: {
      editorArgs: {
        store: optionsDataStore,
        // need to set width directly for Select to size correctly
        style: {width: "99%"}
      }
    }
  },
  {
    label: "text input combining first/last name",
    editor: "text",
    generate: generateName,
    column: {
      get: function (object) {
        return object.firstName + " " + object.lastName;
      },
      set: function (object) {
        // Recombine to single field, and remove our combined field.
        // Admittedly, this won't treat middle names very nicely.
        var parts = object.editor.split(/ +/, 2);
        object.firstName = parts[0];
        object.lastName = parts[1];
        delete object.editor;
      }
    }
  },
  {
    label: "dijit/form/TextBox converting to uppercase on save",
    editor: "dijit/form/TextBox",
    generate: generateTextUC,
    column: {
      set: function (object) {
        return object.editor.toUpperCase();
      }
    }
  }
];
