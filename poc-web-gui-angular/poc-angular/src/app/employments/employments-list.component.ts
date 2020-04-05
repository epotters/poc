import {Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {Employment} from '../core/domain/';

import {EntityListComponent} from '../lib/entity-lib';
import {EntityAnimations} from '../lib/entity-lib/common/animations.animation';
import {employmentMeta as meta} from './employment-meta';
import {EmploymentService} from './employment.service';


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
    renderer: Renderer2,
    public el: ElementRef
  ) {
    super(meta, service, router, renderer, el);
  }
}
