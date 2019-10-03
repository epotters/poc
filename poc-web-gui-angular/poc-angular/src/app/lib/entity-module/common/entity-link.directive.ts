import {Directive, ElementRef, Input, ViewContainerRef} from '@angular/core';
import {EntityMeta} from "..";

@Directive({
  selector: '[entity-link]',
})
export class EntityLinkDirective<T extends Identifiable> {
  @Input() entity: T ;
  @Input() meta: EntityMeta<T>;

  constructor(public element: ElementRef) {
    let url: string = this.meta.namePlural + '/' + this.entity.id;
    element.nativeElement.innerHtml = '<a href="' + url + '">' + this.meta.displayNameRenderer(this.entity) + '</a>';
  }
}
