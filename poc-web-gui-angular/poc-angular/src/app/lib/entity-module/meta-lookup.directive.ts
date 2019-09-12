import {AfterViewInit, Directive, InjectionToken, Input} from "@angular/core";
import {EntityMeta} from "./domain/entity-meta.model";

@Directive({
  selector: 'meta-lookup',
})
export class MetaLookupDirective implements AfterViewInit {

  @Input('entity-type') public entityType: string;
  public meta: EntityMeta<any>;


  constructor() {
  }

  ngAfterViewInit() {
    console.debug('@MetaDirective ngAfterViewInit');
    // this.meta = new InjectionToken<EntityMeta<any>>(this.entityType + 'Meta');
  }


}
