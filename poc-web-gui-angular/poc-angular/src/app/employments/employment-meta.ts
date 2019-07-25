import {EntityMeta} from "../lib/entity-module";
import {Employment} from "../core/domain/";


export const employmentMeta: EntityMeta<Employment> = {

  // General
  name: 'employment',
  namePlural: 'employments',
  displayName: 'Employment',
  displayNamePlural: 'Employments',

  // API
  apiBase: '/employments/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'id',
  defaultSortDirection: 'asc',

  displayedColumns: ['id', 'employer.name', 'employee.firstName', 'employee.lastName'],
  filteredColumns: {
    id: {type: 'text'},
    'employer.name': {type: 'none'},
    'employee.firstName': {type: 'none'},
    'employee.lastName': {type: 'none'}
  },

  columnConfigs: {
    id: {
      label: 'ID',
    },
    'employer.name': {
      label: 'Employer'
    },
    'employee.firstName': {
      label: 'First Name'
    },
    'employee.lastName': {
      label: 'Last Name'
    }
  }

};
