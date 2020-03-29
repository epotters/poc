import {Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {ColumnConfig, EditableListConfig, EntityListComponent, EntityMeta, Identifiable, RelationEntity} from '../..';
import {EntityComponentDescriptor, EntityComponentEntryPointDirective} from './entity-component-entrypoint.directive';


export class ComponentLoader<T extends Identifiable> implements OnInit, OnDestroy {

  component: Type<any>;
  config: any;

  componentRef: ComponentRef<Component>;

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  constructor(
    public meta: EntityMeta<T>,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.debug('Constructing componentloader');
  }

  ngOnInit() {
    this.load();
  }


  ngOnDestroy(): void {
    this.componentRef.destroy();
  }


  // Load the component
  private load() {

    const componentDescriptor: EntityComponentDescriptor = new EntityComponentDescriptor(this.component, this.config);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentDescriptor.component);
    this.componentEntrypoint.viewContainerRef.clear();
    this.componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    // Copy the configuration to the component
    for (const key in componentDescriptor.data) {
      if (componentDescriptor.data.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to ${componentDescriptor.data[key]}`);
        this.componentRef.instance[key] = componentDescriptor.data[key];
      }
    }
  }

}
