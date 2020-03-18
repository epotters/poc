import {Component, ComponentFactoryResolver} from "@angular/core";
import {Organization} from "../core/domain/";
import {OrganizationService} from "./organization.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationEditorComponent} from "./organization-editor.component";
import {organizationMeta} from "./organization-meta";
import {PocAnimations} from "../app-animations";
import {EntityComponentDescriptor} from "../lib/entity-module/common/entity-component-entrypoint.directive";

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
    public dialog: MatDialog
  ) {
    super(organizationMeta, service, route, componentFactoryResolver, dialog);

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
