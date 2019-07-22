import {Component} from "@angular/core";
import {Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'organization-manager',
  templateUrl: './organization-manager.component.html',
  styleUrls: []
})
export class OrganizationManagerComponent extends EntityManagerComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public route: ActivatedRoute
  ) {
    super(organizationMeta, service, route);
  }

}
