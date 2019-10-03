import {EntityMeta} from "../lib/entity-module";
import {Organization} from "../core/domain";


export const organizationMeta: EntityMeta<Organization> = {

  // General
  name: 'organization',
  namePlural: 'organizations',
  displayName: 'Organization',
  displayNamePlural: 'Organizations',

  displayNameRenderer: (organization: Organization) => {
    return organization.name;
  },

  // API
  apiBase: '/organizations/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'name',
  defaultSortDirection: 'asc',



  displayedColumns: ['id', 'name'],

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
    name: {
      label: 'Name'
    },

    employees: {
      label: 'Employees',
      editor: {
        type: 'relation',
        relationEntity: {
          relationClass: 'Employment',
          owner: 'employer',
          columns: ['id', 'startDate', 'endDate', 'employee'],
          sort: 'employee.lastName',
          sortDirection: "asc"
        }
      }
    }

  }
};
