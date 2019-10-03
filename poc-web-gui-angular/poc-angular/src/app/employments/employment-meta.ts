import {EntityMeta} from "../lib/entity-module";
import {Employment, Organization, Person} from "../core/domain/";


export const employmentMeta: EntityMeta<Employment> = {

  // General
  name: 'employment',
  namePlural: 'employments',
  displayName: 'Employment',
  displayNamePlural: 'Employments',

  displayNameRenderer: (employment: Employment) => {
    return 'Employment of ' + employment.employee.lastName + ' at ' + employment.employer.name;
    },
  // API
  apiBase: '/employments/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'id',
  defaultSortDirection: 'asc',

  displayedColumns: ['id', 'startDate', 'employer', 'employee'],


  columnConfigs: {
    id: {
      label: 'ID',
      editor: {type: 'none'},
      filter: {type: 'text'}
    },
    startDate: {
      label: 'Start date',
      editor: {type: 'date'}
    },
    endDate: {
      label: 'End date',
      editor: {type: 'date'}
    },
    employer: {
      label: 'Employer',
      renderer: (entity, value) => {
        return entity.employer.name;
      },
      editor: {
        type: 'autocomplete',
        relatedEntity: {
          name: 'organization',
          serviceName: 'OrganizationService',
          displayField: 'name',
          displayOption: (entity: Organization) => {
            console.debug('Displaying organization');
            return (entity) ? entity['name'] : null;
          }
        }
      },
      validators: [
        {type: 'required', message: 'Employer is required'}
      ]
    },

    employee: {
      label: 'Employee',
      renderer: (entity: Employment, value) => {
        return entity.employee.firstName + ' ' + ((entity.employee.prefix) ? (entity.employee.prefix) + ' ' : '') + entity.employee.lastName;
      },
      editor: {
        type: 'autocomplete',
        relatedEntity: {
          name: 'person',
          serviceName: 'PersonService',
          displayField: 'lastName',
          displayOption: (entity: Person) => {
            console.debug('Displaying person');
            return (entity) ?
              entity.firstName + ' ' + ((entity.prefix) ? (entity.prefix) + ' ' : '') + entity.lastName :
              null;
          }
        }
      },
      validators: [
        {type: 'required', message: 'Employee is required'}
      ]
    },
    description: {
      label: 'Description',
      editor: {
        type: 'textarea'
      },
      filter: {
        type: 'text'
      }
    }
  }
};
