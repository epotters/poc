import {EntityListComponent} from "../lib/entity-module";
import {Organization} from "../core/domain/";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {OrganizationService} from "./organization.service";
import {organizationMeta} from "./organization-meta";
import {EntityListOfCardsComponent} from "../lib/entity-module/entity-list-of-cards.component";

@Component({
  selector: 'organization-selector',
  templateUrl: './organization-selector.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css']
})
export class OrganizationSelectorComponent extends EntityListOfCardsComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(organizationMeta, service, router, route, dialog);
  }


  displayOption(organization?: Organization): string | undefined {
    return organization.name;
  }

}
