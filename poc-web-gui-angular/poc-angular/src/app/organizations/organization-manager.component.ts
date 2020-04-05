import {Component, ComponentFactoryResolver} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {PocAnimations} from '../app-animations';
import {Organization} from '../core/domain/';
import {EntityManagerComponent} from '../lib/entity-lib';
import {ComponentLoader, EntityComponentDescriptor} from '../lib/entity-lib/common/component-loader/component-loader';
import {OrganizationEditorComponent} from './organization-editor.component';

import {OrganizationListComponent} from './organization-list.component';
import {organizationMeta} from './organization-meta';
import {OrganizationService} from './organization.service';

@Component({
  selector: 'organization-manager',
  templateUrl: './organization-manager.component.html',
  styleUrls: [],
  animations: [
    PocAnimations.fadeInOut,
    PocAnimations.slideInOut
  ]
})
export class OrganizationManagerComponent extends EntityManagerComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    public componentLoader: ComponentLoader<Organization>
  ) {
    super(organizationMeta, service, route, dialog, componentFactoryResolver);

    this.editorVisible = false;
    this.listVisible = false;
  }

  openDialogWithList() {
    const entityListComponentDescriptor = new EntityComponentDescriptor(OrganizationListComponent, {});
    this.openDialogWithEntityComponent(entityListComponentDescriptor);
  }


  openDialogWithEditor(entity?: Organization) {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(OrganizationEditorComponent, {
      entityToLoad: entity
    });
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }
}
