import {EntityListComponent} from '../lib/entity-lib';
import {Organization} from '../core/domain/';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {OrganizationService} from './organization.service';
import {organizationMeta as meta} from './organization-meta';
import {EntityAnimations} from '../lib/entity-lib/common/animations.animation';


@Component({
  selector: 'organization-list-card',
  templateUrl: '../lib/entity-lib/entity-list.component.html',
  styleUrls: ['../lib/entity-lib/entity-list.component.css'],
  animations: [
    EntityAnimations.slideTo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationListComponent extends EntityListComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, dialog);
  }
}
