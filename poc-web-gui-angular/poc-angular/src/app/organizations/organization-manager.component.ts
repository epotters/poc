import {Component, ViewChild} from "@angular/core";
import {Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationComponent} from "./organization.component";

@Component({
  selector: 'organization-manager',
  templateUrl: './organization-manager.component.html',
  styleUrls: []
})
export class OrganizationManagerComponent extends EntityManagerComponent<Organization> {

  // @ViewChild(OrganizationListComponent, {static: true}) list: OrganizationListComponent;
  // @ViewChild(OrganizationComponent, {static: true}) editor: OrganizationComponent;

  constructor(
    public service: OrganizationService,
  ) {
    super(organizationMeta, service);
  }

}
