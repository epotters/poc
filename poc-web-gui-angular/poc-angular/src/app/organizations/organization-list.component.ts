import {EntityListComponent} from "../lib/entity-module";
import {Organization} from "../core/domain/";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {OrganizationService} from "./organization.service";
import {OrganizationMeta} from "./organization-meta";

@Component({
  selector: 'organization-list-card',
  templateUrl: './organization-list.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css']
})
export class OrganizationListComponent extends EntityListComponent<Organization> {

  constructor(
    public meta: OrganizationMeta,
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(meta, service, router, route, dialog);
  }

}
