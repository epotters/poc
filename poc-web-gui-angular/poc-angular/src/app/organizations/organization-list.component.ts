import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';

import {EntityListComponent} from 'entity-lib';

import {Organization} from '../core/domain/';
import {organizationMeta as meta} from './organization-meta';
import {OrganizationService} from './organization.service';


@Component({
  selector: 'organization-list-card',
  templateUrl: '../lib/entity-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationListComponent extends EntityListComponent<Organization> {


  constructor(
    public service: OrganizationService,
    public router: Router,
    renderer: Renderer2,
    public el: ElementRef
  ) {
    super(meta, service, router, renderer, el);
  }
}
