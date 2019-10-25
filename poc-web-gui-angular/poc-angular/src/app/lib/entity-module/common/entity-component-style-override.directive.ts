import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[component-style]',
})
export class EntityComponentStyleOverrideDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
