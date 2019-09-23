import {Component, ComponentFactoryResolver} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  EntityComponentDescriptor,
  EntityComponentDialogComponent
} from "../../lib/entity-module/dialog/entity-component-dialog.component";
import {PersonListComponent} from "../person-list.component";
import {PersonEditorComponent} from "../person-editor.component";
import {Person} from "../../core/domain";


/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-with-list-demo',
  templateUrl: 'dialog-with-list-demo.component.html'
})
export class DialogWithListDemoComponent {

  title: string = 'Demo dynamically loading a component and showing it in a dialog';
  entity: Person;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {
    console.debug('Creating "' + this.title + '"');
  }


  openDialogWithList() {
    const entityListComponentDescriptor = new EntityComponentDescriptor(PersonListComponent, {});
    this.openDialogWithEntityComponent(entityListComponentDescriptor);
  }


  openDialogWithEditor() {
    const entityEditorComponentDescriptor = new EntityComponentDescriptor(PersonEditorComponent, {});
    this.openDialogWithEntityComponent(entityEditorComponentDescriptor);
  }


  openDialogWithEntityComponent(componentToShow: EntityComponentDescriptor): void {
    const dialogRef = this.dialog.open(EntityComponentDialogComponent, {
      width: '600px',
      data: {
        componentFactoryResolver: this.componentFactoryResolver,
        componentDescriptor: componentToShow,
        entity: this.entity
      }
    });

    dialogRef.afterClosed().subscribe(entity => {
      console.log('The dialog was closed');
      if (entity) {
        this.entity = entity;
      }
    });
  }


}
