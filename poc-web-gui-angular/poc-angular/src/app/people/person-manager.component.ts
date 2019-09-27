import {Component, ComponentFactoryResolver} from "@angular/core";
import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";
import {EntityManagerComponent} from "../lib/entity-module";
import {ActivatedRoute} from "@angular/router";
import {EntityComponentDescriptor} from "../lib/entity-module/dialog/entity-component-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PersonListComponent} from "./person-list.component";
import {PersonEditorComponent} from "./person-editor.component";

@Component({
  selector: 'person-manager',
  templateUrl: './person-manager.component.html',
  styleUrls: []
})
export class PersonManagerComponent extends EntityManagerComponent<Person> {

  constructor(
    public service: PersonService,
    public route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    super(personMeta, service, route, componentFactoryResolver, dialog);
  }

  openDialogWithList() {
    const entityListComponentDescriptor = new EntityComponentDescriptor(PersonListComponent,
      {
        columns: this.meta.displayedColumnsDialog,
        title: 'Minimal list with all features hidden',
        headerVisible: false,
        paginatorVisible: false,
        filterVisible: false,
        editorVisible: false
      });
    this.openDialogWithEntityComponent(entityListComponentDescriptor);
  }

  openDialogWithEditor() {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(PersonEditorComponent, {});
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }

}
