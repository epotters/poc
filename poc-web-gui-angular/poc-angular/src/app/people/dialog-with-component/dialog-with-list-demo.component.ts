import {Component, ComponentFactoryResolver} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  EntityComponent,
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

    let columnsToShow: string[] = [];
  }




  openDialogWithList() {
    const entityListComponent = new EntityComponent(PersonListComponent, {});
    this.openDialogWithEntityComponent(entityListComponent);
  }



  openDialogWithEditor() {
    const entityEditorComponent = new EntityComponent(PersonEditorComponent, {});
    this.openDialogWithEntityComponent(entityEditorComponent);
  }


  openDialogWithEntityComponent(componentToShow: EntityComponent): void {
    const dialogRef = this.dialog.open(EntityComponentDialogComponent, {
      width: '600px',
      data: {
        componentFactoryResolver: this.componentFactoryResolver,
        component: componentToShow,
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
