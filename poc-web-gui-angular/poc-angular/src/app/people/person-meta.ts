import {EntityMeta, SelectOption} from "../lib/entity-module";
import {Person} from "../core/domain";
import {of as observableOf} from "rxjs";

const genderOptions: SelectOption[] = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'}
];

export const personMeta: EntityMeta<Person> = {

  // General
  name: 'person',
  namePlural: 'people',
  displayName: 'Person',
  displayNamePlural: 'People',

  // API
  apiBase: '/people/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'lastName',
  defaultSortDirection: 'asc',
  defaultFilterField: 'lastName',

  displayedColumns: ['id', 'firstName', 'prefix', 'lastName', 'gender', 'birthDate', 'birthPlace'],

  filteredColumns: {
    id: {type: "text"},
    firstName: {type: "text"},
    prefix: {type: "none"},
    lastName: {type: "text"},
    gender: {
      type: "select",
      options: genderOptions
    },
    birthDate: {type: "date"},
    birthPlace: {type: "text"}
  },

  columnConfigs: {
    id: {
      label: 'ID'
    },
    firstName: {
      label: 'First name'
    },
    prefix: {
      label: 'Prefix'
    },
    lastName: {
      label: 'Last name'
    },
    gender: {
      label: 'M/F',
      renderer: (value) => {
        for (let option of genderOptions) {
          if (option.value === value) {
            return option.label;
          }
        }
        return value;
      },
      editor: {
        type: 'select',
        options: genderOptions
      }
    },
    birthDate: {
      label: 'Date of birth'
    },
    birthPlace: {
      label: 'Birth place'
    }
  },


  // Editor
  validationMessages: {
    'firstName': [
      {type: 'required', message: 'First name is required'},
      {type: 'pattern', message: 'First name can only contain characters, dashes and spaces'}
    ],
    'lastName': [
      {type: 'required', message: 'Last name is required'},
      {type: 'pattern', message: 'Last name can only contain characters, dashes and spaces'},
      {type: 'maxlength', message: 'Last name must not be longer than 60 characters'}
    ]
  }
};

