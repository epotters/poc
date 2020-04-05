import {ComponentFactoryResolver, ComponentRef, Injectable, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {Identifiable} from '../..';
import {EntityComponentEntryPointDirective} from './entity-component-entrypoint.directive';


export class EntityComponentDescriptor {
  constructor(public component: Type<any>, public data: any) {
  }
}

// Source for component loader: https://angular.io/guide/dynamic-component-loader

@Injectable({
  providedIn: 'root'
})
export class ComponentLoader<T extends Identifiable> implements OnInit, OnDestroy {

  component: Type<any>;
  config: any;
  componentRef: ComponentRef<any>;

  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.debug('Constructing componentloader');
  }

  ngOnInit() {
    if (!!this.componentEntrypoint) {
      console.warn('Component loader needs an entrypoint to be defined');
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }


  // Load the component
  private load() {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.componentEntrypoint.viewContainerRef.clear();
    this.componentRef = this.componentEntrypoint.viewContainerRef.createComponent(componentFactory);

    // Copy the configuration to the component
    for (const key in this.config) {
      if (this.config.hasOwnProperty(key)) {
        console.debug(`Set @input ${key} to ${this.config[key]}`);
        this.componentRef.instance[key] = this.config[key];
      }
    }
  }

  private unload() {
    this.componentEntrypoint.viewContainerRef.clear();
  }

}
