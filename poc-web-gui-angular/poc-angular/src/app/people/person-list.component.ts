import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {EntityListComponent} from 'entity-lib';
import {NGXLogger} from 'ngx-logger';
import {Person} from '../core/domain/';
import {personMeta as meta} from './person-meta';
import {PersonService} from './person.service';

@Component({
  selector: 'person-list-card',
  templateUrl: '../lib/entity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent extends EntityListComponent<Person> {

  constructor(
    public service: PersonService,
    public router: Router,
    public el: ElementRef,
    public logger: NGXLogger
  ) {
    super(meta, service, router, el, logger);
  }

}

