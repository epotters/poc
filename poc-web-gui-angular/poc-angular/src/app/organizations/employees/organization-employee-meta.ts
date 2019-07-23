import {EntityMeta} from "../../lib/entity-module";
import {Employee} from "../../core/domain/employee.model";


export const employeeMeta: EntityMeta<Employee> = {

  // General
  name: 'employee',
  namePlural: 'employees',
  displayName: 'Employee',
  displayNamePlural: 'Employees',

  // API
  apiBase: '/organizations/employees/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'id',
  defaultSortDirection: 'asc',

  displayedColumns: ['id', 'employer.name', 'person.firstName', 'person.lastName'],
  filteredColumns: {
    id: {type: 'text'},
    'employer.name': {type: 'none'},
    'person.firstName': {type: 'none'},
    'person.lastName': {type: 'none'}
  },

  columnConfigs: {
    id: {
      label: 'ID',
    },
    'employer.name': {
      label: 'Employer'
    },
    'person.firstName': {
      label: 'First Name'
    },
    'person.lastName': {
      label: 'Last Name'
    }
  }

};
