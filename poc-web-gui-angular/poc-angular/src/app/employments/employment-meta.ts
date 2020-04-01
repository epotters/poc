import {EntityMeta} from '../lib/entity-lib';
import {Employment, Organization, Person} from '../core/domain/';


export const employmentMeta: EntityMeta<Employment> = {

  // General
  name: 'employment',
  namePlural: 'employments',
  displayName: 'Employment',
  displayNamePlural: 'Employments',

  displayNameRenderer: (employment: Employment) => {
    return employment.employee.lastName + ' at ' + employment.employer.name;
  },

  // API
  apiBase: '/employments/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'id',
  defaultSortDirection: 'asc',

  displayedColumns: ['id', 'startDate', 'endDate', 'employer', 'employee', 'description'],


  columnConfigs: {
    id: {
      label: 'ID',
      editor: {type: 'none'},
      filter: {type: 'text'}
    },
    startDate: {
      label: 'Start date',
      editor: {type: 'date'},
      filter: {type: 'text'}
    },
    endDate: {
      label: 'End date',
      editor: {type: 'date'},
      filter: {type: 'text'}
    },
    employer: {
      label: 'Employer',
      renderer: (entity: Employment, value) => {
        return entity.employer.name;
      },
      editor: {
        type: 'entity-selector',
        relatedEntity: {
          name: 'organization',
          namePlural: 'organizations',
          serviceName: 'OrganizationService',
          displayField: 'name',
          displayOption: (entity: Organization) => {
            console.debug('Displaying organization');
            return (entity) ? entity['name'] : null;
          }
        }
      },
      filter: {type: 'text'},
      validators: [
        {type: 'required', message: 'Employer is required'}
      ]
    },

    employee: {
      label: 'Employee',
      renderer: (entity: Employment, value) => {
        return entity.employee.firstName + ' ' + ((entity.employee.prefix) ?
          (entity.employee.prefix) + ' ' : '') + entity.employee.lastName;
      },
      editor: {
        type: 'entity-selector',
        relatedEntity: {
          name: 'person',
          namePlural: 'people',
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
      filter: {type: 'text'},
      validators: [
        {type: 'required', message: 'Employee is required'}
      ]
    },
    description: {
      label: 'Description',
      editor: {
        type: 'textarea'
      },
      rowEditor: {
        type: 'text'
      }
    }
  }
};
