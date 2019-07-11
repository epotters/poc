import {EventEmitter, Output, ViewChild} from '@angular/core';
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {
  PblDataSource,
  PblDataSourceAdapter,
  PblDataSourceTriggerChangedEvent,
  PblNgridColumnSet,
  PblNgridComponent
} from "@pebula/ngrid";
import {EntityPblDataSource} from "./entity-pbl-data-source";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";


export abstract class EntityListNGridComponent<T extends Identifiable> {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: PblDataSource;

  @ViewChild(PblNgridComponent, {static: true}) table: PblNgridComponent<T>;

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public columns: PblNgridColumnSet
  ) {
    console.debug('Constructing the EntityListNGridComponent for type ' + this.meta.displayNamePlural);

    let sourceFactory = (event: PblDataSourceTriggerChangedEvent) => {
      console.log('Inside adapter, received event ', event);
      return this.service.listEntitiesOnly()
        .pipe(
          catchError(() => of([]))
        );
    };
    let adapter: PblDataSourceAdapter = new PblDataSourceAdapter(sourceFactory);

    this.dataSource = new EntityPblDataSource<T>(meta, service, adapter);
  }

  ngOnInit() {
    console.debug('Initializing the EntityListNGridComponent for type ' + this.meta.displayNamePlural);
  }

  refresh(): void {
    this.table.ds.refresh();
  }

  dropped(e) {
  }
}
