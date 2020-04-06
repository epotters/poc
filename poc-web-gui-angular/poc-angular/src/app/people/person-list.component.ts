import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {EntityListComponent} from 'entity-lib';
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
    renderer: Renderer2,
    public el: ElementRef
  ) {
    super(meta, service, router, renderer, el);
  }

}

