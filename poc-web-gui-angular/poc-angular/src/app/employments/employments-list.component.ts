import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';

import {EntityListComponent} from 'entity-lib';
import {Employment} from '../core/domain/';
import {employmentMeta as meta} from './employment-meta';
import {EmploymentService} from './employment.service';


@Component({
  selector: 'employment-list-card',
  templateUrl: '../lib/entity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
