import {DataSource} from '@angular/cdk/collections';

import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

import {FieldFilter} from './domain/filter.model';
import {EntityService} from './entity.service';
import {EntityMeta} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';


export class EntityDataSource<T extends Identifiable> implements DataSource<T> {

  public entitiesSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private totalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public entities$: Observable<T[]> = this.entitiesSubject.asObservable();
  public total$: Observable<number> = this.totalSubject.asObservable();
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>
  ) {
    console.debug(`Creating EntityDataSource for type ${this.meta.displayName}`);
  }

  public connect(): Observable<T[]> {
    console.debug(`Connecting the ${this.meta.displayNamePlural.toLowerCase()} datasource...`);
    return this.entitiesSubject.asObservable();
  }

  public disconnect(): void {
    console.debug(`Disconnecting the ${this.meta.displayNamePlural.toLowerCase()} datasource...`);
    this.entitiesSubject.complete();
    this.totalSubject.complete();
    this.loadingSubject.complete();
  }

  public loadEntities(
    filter: FieldFilter[],
    sortField: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number): void {

    console.debug(`Datasource loading ${this.meta.displayNamePlural.toLowerCase()} ...`);
    this.loadingSubject.next(true);

    this.service.list(filter, sortField, sortDirection, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(entityResult => {

        console.debug(`Datasource ${this.meta.displayNamePlural.toLowerCase()} received result`, entityResult);

        this.entitiesSubject.next(entityResult.entities);
        this.totalSubject.next(entityResult.total);
        this.loadingSubject.next(false);

        console.debug(`Datasource ${this.meta.displayNamePlural.toLowerCase()} processed result`);
      });
  }

  public clearEntities() {
    this.entitiesSubject.next([]);
    this.totalSubject.next(0);
    this.loadingSubject.next(false);
  }
}
