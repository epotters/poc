import {Component, ComponentFactoryResolver, Inject, Type, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EntityComponentEntryPointDirective} from "./entity-component-entrypoint.directive";


export class EntityComponent {
  constructor(public component: Type<any>, public data: any) {
  }
}

export interface DialogData {
  componentFactoryResolver: ComponentFactoryResolver;
  component: EntityComponent;
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
  }

  ngOnInit() {
    this.loadComponent(this.dialogData.component);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadComponent(entityComponent: EntityComponent) {
    const componentFactory = this.dialogData.componentFactoryResolver.resolveComponentFactory(entityComponent.component);
    this.componentEntrypoint.viewContainerRef.clear();
    const componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);
    (<EntityComponent>componentRef.instance).data = entityComponent.data;
  }

}
