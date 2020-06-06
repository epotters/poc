import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {Router} from '@angular/router';

import {EntityListComponent}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';
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
    public el: ElementRef,
    public logger: NGXLogger
  ) {

    super(meta, service, router, el, logger);

  }
}
