import {Organization, Person} from "./core/domain";
import {EntityMeta} from "./lib/entity-module";

export class MetaConfig {

  public static personMeta: EntityMeta<Person> = {

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
    displayedColumns: ['id', 'name'],

    // Form
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

  // public static organizationMeta: EntityMeta<Organization> = {
  //   // General
  //   name: 'organization',
  //   namePlural: 'organizations',
  //   displayName: 'Organization',
  //   displayNamePlural: 'Organizations',
  //
  //   // API
  //   apiBase: '/organizations/',
  //
  //   // List
  //   defaultSortField: 'id',
  //   displayedColumns: ['id']
  // };


  public static metas: Map<String, EntityMeta<any>> = new Map([
    ['person', MetaConfig.personMeta]
    // ['organization', MetaConfig.organizationMeta]
  ]);


}
