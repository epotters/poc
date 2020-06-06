import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {Router} from '@angular/router';

import {EntityListComponent}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';

import {Organization} from '../../core/domain';
import {organizationMeta as meta} from './organization-meta';
import {OrganizationService} from './organization.service';


@Component({
  selector: 'organization-list-card',
  templateUrl: '../../lib/entity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationListComponent extends EntityListComponent<Organization> {


  constructor(
    public service: OrganizationService,
    public router: Router,
    public el: ElementRef,
    public logger: NGXLogger
  ) {
    super(meta, service, router, el, logger);
  }
}
