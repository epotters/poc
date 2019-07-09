import {EntityService} from "../lib/entity-module";
import {Organization} from "../core/domain";
import {ApiService} from "../core/service";
import {organizationMeta} from "./organization-meta";

export class OrganizationService extends EntityService<Organization> {

  constructor(
    public apiService: ApiService) {
    super(organizationMeta, apiService);
  }
}
