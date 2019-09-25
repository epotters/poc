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
            console.debug('Displaying organization');
            return (entity) ? entity['name'] : null;
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
