import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {EntityMeta, RelationEntity} from './domain/entity-meta.model';
import {FieldFilter} from './domain/filter.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityService} from './entity.service';

@Directive()
export abstract class EntityDetailComponent<T extends Identifiable> implements OnChanges {

  @Input() entity: T;

  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>
  ) {
    console.debug('Constructing the EntityDetailComponent for type ' + this.meta.displayName);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.debug('Detail ngOnChanges', changes);
  }


  // WIP
  listRelationsInline(fieldName: string): string {
    const relation: RelationEntity | undefined = this.meta.columnConfigs[fieldName]!.editor!.relationEntity;
    let html = '';
    if (!relation) {
      return '';
    }

    const filter: FieldFilter = {
      name: relation.owner,
      rawValue: `${this.entity!.id}`
    };


    return html;
  }


}
