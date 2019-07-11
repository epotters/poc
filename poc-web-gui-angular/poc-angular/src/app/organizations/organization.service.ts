import {EntityService} from "../lib/entity-module";
import {Organization} from "../core/domain";
import {PocApiService} from "../core/service";
import {organizationMeta} from "./organization-meta";

export class OrganizationService extends EntityService<Organization> {

  constructor(
    public apiService: PocApiService) {
    super(organizationMeta, apiService);
  }
}
