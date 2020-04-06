import {animate, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {ComponentLoader, EntityListOfCardsComponent} from 'entity-lib';
import {Organization} from '../core/domain/';
import {organizationMeta} from './organization-meta';
import {OrganizationService} from './organization.service';

@Component({
  selector: 'organization-list-of-cards',
  templateUrl: './organization-list-of-cards.component.html',
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
    public dialog: MatDialog,
    public componentLoader: ComponentLoader<Organization>
  ) {

    super(organizationMeta, service, router, route, dialog, componentLoader);
  }


  showEvent($event) {
    console.debug('PageEvent received:');
    console.debug($event);
  }

}
