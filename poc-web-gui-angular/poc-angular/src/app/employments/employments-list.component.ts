import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {EntityListComponent} from '../lib/entity-lib';
import {employmentMeta as meta} from './employment-meta';
import {Employment} from '../core/domain/'
import {EmploymentService} from './employment.service';
import {EntityAnimations} from '../lib/entity-lib/common/animations.animation';


@Component({
  selector: 'employment-list-card',
  templateUrl: '../lib/entity-lib/entity-list.component.html',
  styleUrls: ['../lib/entity-lib/entity-list.component.css'],
  animations: [
    EntityAnimations.slideTo
  ]
})
export class EmploymentListComponent extends EntityListComponent<Employment> {

  constructor(
    public service: EmploymentService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, dialog);
  }
}
