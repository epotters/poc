import {Component, ComponentFactoryResolver, ComponentRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EntityListComponent, Identifiable} from '..';
import {EntityComponentDescriptor} from '../common/component-loader/component-loader';
import {EntityComponentEntryPointDirective} from '../common/component-loader/entity-component-entrypoint.directive';


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
export class EntityComponentDialogComponent<T extends Identifiable> implements OnDestroy, OnInit {

  private componentRef: ComponentRef<EntityListComponent<T>>;

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  constructor(
    public dialogRef: MatDialogRef<EntityComponentDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {

    console.debug('Constructing EntityComponentDialog with data: ', dialogData);
  }

  ngOnInit() {
    this.loadComponent(this.dialogData.componentDescriptor);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadComponent(componentDescriptor: EntityComponentDescriptor) {
    const componentFactory = this.dialogData.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    this.componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    // Copy the configuration to the component
    for (const key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to value ${componentDescriptor.data[key]}`);
        this.componentRef.instance[key] = componentDescriptor.data[key];
      }
    }
  }

}
