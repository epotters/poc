import {Organization} from "../core/domain/";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {OrganizationService} from "./organization.service";
import {organizationMeta} from "./organization-meta";
import {EntityListOfCardsComponent} from "../lib/entity-module/entity-list-of-cards.component";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'organization-list-of-cards',
  templateUrl: './organization-list-of-cards.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class OrganizationListOfCardsComponent extends EntityListOfCardsComponent<Organization> {

  pageSize = 1;

  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(organizationMeta, service, router, route, dialog);
  }


  showEvent($event) {
    console.debug('PageEvent received:');
    console.debug($event);
  }

}
