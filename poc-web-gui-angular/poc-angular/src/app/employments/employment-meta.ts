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

  displayedColumns: ['id', 'employer', 'employee.firstName', 'employee.lastName'],
  filteredColumns: {
    id: {type: 'text'},
    'employer': {type: 'none'},
    'employee.firstName': {type: 'none'},
    'employee.lastName': {type: 'none'}
  },

  columnConfigs: {
    id: {
      label: 'ID',
    },
    employer: {
      label: 'Employer',
      renderer: (entity, value) => {
        return entity.employer.name;
      },
      editor: {
        type: "autocomplete",
        relatedEntity: {
          name: 'organization',
          serviceName: 'OrganizationService',
          displayField: 'name',
          displayOption: (entity) => {
            console.debug('Displayning organization');
            return entity['name']
          }
        }
      }
    },
    'employee.firstName': {
      label: 'First Name'
    },
    'employee.lastName': {
      label: 'Last Name'
    }
  }
};
