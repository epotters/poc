import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[entity-component-entrypoint]',
})
export class EntityComponentEntryPointDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
