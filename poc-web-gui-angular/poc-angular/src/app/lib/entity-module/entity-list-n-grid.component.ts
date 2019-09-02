import {EventEmitter, Output, ViewChild} from '@angular/core';
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {createDS, PblDataSource, PblNgridColumnSet, PblNgridComponent} from "@pebula/ngrid";
import {FieldFilter} from "./domain/filter.model";
import {map} from "rxjs/operators";


export abstract class EntityListNGridComponent<T extends Identifiable> {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: PblDataSource<T>;

  @ViewChild(PblNgridComponent, {static: true}) table: PblNgridComponent<T>;

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public columns: PblNgridColumnSet
  ) {
    console.debug('Constructing the EntityListNGridComponent for type ' + this.meta.displayNamePlural);


    this.dataSource = createDS<T>()
      .setCustomTriggers('filter', 'pagination', 'sort')
      .onTrigger(event => {

          console.debug('Event on the next line');
          console.debug(event);

          let filters: FieldFilter[] = [];
          if (event.filter.curr.columns) {
            for (var column of event.filter.curr.columns) {
              filters.push({name: column.id, rawValue: event.filter.curr.filter});
            }
          }
          let sortField: string = (event.sort.curr.column) ? event.sort.curr.column.id : 'id';
          let sortDirection: string = (event.sort.curr.sort) ? event.sort.curr.sort.order : 'asc';
          let pageNumber: number = (event.pagination.page.curr) ? event.pagination.page.curr : 0;
          let pageSize: number = 10;

          return this.service.list(filters, sortField, sortDirection, pageNumber, pageSize)
            .pipe(map(entityResult => {
              event.updateTotalLength(entityResult.total);
              return entityResult.entities;
            }));
        }
      )
      .create();
  }
}
