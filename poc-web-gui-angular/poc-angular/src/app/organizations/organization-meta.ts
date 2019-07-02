import {EntityMeta} from "../lib/entity-module";
import {Organization} from "../core/domain";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class OrganizationMeta implements EntityMeta<Organization> {

  // General
  name = 'organization';
  namePlural = 'organizations';
  displayName = 'Organization';
  displayNamePlural = 'Organizations';

  // API
  apiBase = '/organizations/';

  // List
  defaultPageSize = 150;
  defaultSortField = 'id';
  defaultSortDirection = 'asc';
  displayedColumns = ['id', 'name'];

}
