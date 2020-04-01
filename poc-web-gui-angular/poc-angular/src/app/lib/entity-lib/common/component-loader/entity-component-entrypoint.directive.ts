import {Directive, Type, ViewContainerRef} from '@angular/core';


export class EntityComponentDescriptor {
  constructor(public component: Type<any>, public data: any) {
  }
}


@Directive({
  selector: '[entity-component-entrypoint]',
})
export class EntityComponentEntryPointDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
