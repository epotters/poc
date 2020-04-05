import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {Organization} from '../core/domain/';
import {EntityListComponent} from '../lib/entity-lib';
import {EntityAnimations} from '../lib/entity-lib/common/animations.animation';
import {organizationMeta as meta} from './organization-meta';
import {OrganizationService} from './organization.service';


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
    renderer: Renderer2,
    public el: ElementRef
  ) {
    super(meta, service, router, renderer, el);
  }
}
