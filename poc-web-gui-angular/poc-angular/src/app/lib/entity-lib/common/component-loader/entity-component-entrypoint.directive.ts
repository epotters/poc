import {Directive, Input, ViewContainerRef} from '@angular/core';


@Directive({
  selector: '[entity-component-entrypoint]',
})
export class EntityComponentEntryPointDirective {

  @Input() entrypointId: string;

  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
