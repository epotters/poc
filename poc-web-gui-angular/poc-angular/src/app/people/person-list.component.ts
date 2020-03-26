import {EntityListComponent} from '../lib/entity-module';
import {Person} from '../core/domain/';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PersonService} from './person.service';
import {personMeta as meta} from './person-meta';
import {EntityAnimations} from '../lib/entity-module/common/animations.animation';

@Component({
  selector: 'person-list-card',
  templateUrl: '../lib/entity-module/entity-list.component.html',
  animations: [
    EntityAnimations.slideTo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent extends EntityListComponent<Person> {
  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, dialog);
  }
}

