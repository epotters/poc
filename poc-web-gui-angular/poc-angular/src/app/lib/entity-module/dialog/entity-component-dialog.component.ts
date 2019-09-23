import {Component, ComponentFactoryResolver, Inject, Type, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EntityComponentEntryPointDirective} from "./entity-component-entrypoint.directive";


export class EntityComponentDescriptor {
  constructor(public component: Type<any>, public data: any) {
  }
}

export interface DialogData {
  componentFactoryResolver: ComponentFactoryResolver;
  componentDescriptor: EntityComponentDescriptor;
  entity: any;
}

// Source for component loader: https://angular.io/guide/dynamic-component-loader

@Component({
  selector: 'entity-component-dialog',
  templateUrl: 'entity-component-dialog.component.html'
})
export class EntityComponentDialogComponent<T extends Identifiable> {

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  constructor(
    public dialogRef: MatDialogRef<EntityComponentDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {

    console.debug(dialogData);
  }

  ngOnInit() {
    this.loadComponent(this.dialogData.componentDescriptor);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadComponent(componentDescriptor: EntityComponentDescriptor) {
    const componentFactory = this.dialogData.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    const componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);
    (<EntityComponentDescriptor>componentRef.instance).data = componentDescriptor.data;
  }

}
