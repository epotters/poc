import {EntityService} from "../lib/entity-module";
import {Organization} from "../core/domain";
import {ApiService} from "../core/service";
import {OrganizationMeta} from "./organization-meta";

export class OrganizationService extends EntityService<Organization> {

  constructor(
    public meta: OrganizationMeta,
    public apiService: ApiService) {
    super(meta, apiService);
  }
}
