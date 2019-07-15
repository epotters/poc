import {EntityMeta} from "../lib/entity-module";
import {Organization} from "../core/domain";


export const organizationMeta: EntityMeta<Organization> = {

  // General
  name: 'organization',
  namePlural: 'organizations',
  displayName: 'Organization',
  displayNamePlural: 'Organizations',

  // API
  apiBase: '/organizations/',

  // List
  defaultPageSize: 150,
  defaultSortField: 'name',
  defaultSortDirection: 'asc',
  defaultFilterField: 'name',

  displayedColumns: ['id', 'name'],
  filteredColumns: {
    id: {type: 'text'},
    name: {type: 'text'}
  },

  columnConfigs: {
    id: {
      label: 'ID',
    },
    name: {
      label: 'Name'
    }
  }
};
