import {EntityMeta, SelectOption} from "../lib/entity-module";
import {Person} from "../core/domain";

const genderOptions: SelectOption[] = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'}
];

const personNamePattern: string = '[a-zA-Z -]*';

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

  displayedColumns: ['id', 'firstName', 'prefix', 'lastName', 'gender', 'birthDate', 'birthPlace'],
  displayedColumnsDialog: ['id', 'firstName', 'prefix', 'lastName', 'gender'],

  columnConfigs: {
    id: {
      label: 'ID',
      editor: {
        type: 'none'
      },
      filter: {
        type: 'text'
      }
    },
    firstName: {
      label: 'First name',
      validators: [

        {type: 'required', message: 'First name is required'},
        {
          type: 'pattern',
          argument: personNamePattern,
          message: 'First name can only contain characters, dashes and spaces'
        }

      ]
    },
    prefix: {
      label: 'Prefix'
    },
    lastName: {
      label: 'Last name',
      validators: [
        {type: 'required', message: 'Last name is required'},
        {
          type: 'pattern',
          message: 'Last name can only contain characters, dashes and spaces',
          argument: personNamePattern
        },
        {type: 'maxLength', message: 'Last name must not be longer than 60 characters', argument: 60}
      ]
    },
    gender: {
      label: 'M/F',
      renderer: (entity, value) => {
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
      label: 'Date of birth',
      editor: {
        type: 'date'
      }
    },
    birthPlace: {
      label: 'Birth place'
    }
  }
};


