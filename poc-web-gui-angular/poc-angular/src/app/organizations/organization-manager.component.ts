import {Component, ComponentFactoryResolver} from "@angular/core";
import {Organization} from "../core/domain/";
import {OrganizationService} from "./organization.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";
import {EntityComponentDescriptor} from "../lib/entity-module/dialog/entity-component-dialog.component";
import {MatDialog} from "@angular/material/dialog";

import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationEditorComponent} from "./organization-editor.component";
import {organizationMeta} from "./organization-meta";

@Component({
  selector: 'organization-manager',
  templateUrl: './organization-manager.component.html',
  styleUrls: []
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


  openDialogWithEditor() {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(OrganizationEditorComponent, {});
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }

}
