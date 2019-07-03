import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {FilterSet} from "../../common/filter.model";
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";


export class EntityDataSource<T extends Identifiable> implements DataSource<T> {

  private entitiesSubject = new BehaviorSubject<T[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  public total =  this.totalSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>
  ) {
    console.debug('Creating EntityDataSource for type ' + this.meta.displayName);
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    console.debug('Connecting datasource...');
    return this.entitiesSubject.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    console.debug('Disconnecting datasource...');
    this.entitiesSubject.complete();
    this.totalSubject.complete();
    this.loadingSubject.complete();
  }

  public loadEntities (
    filter: FilterSet,
    sortField: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number): void {

    console.debug('Loading ' + this.meta.displayNamePlural.toLowerCase() + '...');

    this.loadingSubject.next(true);

    this.service.list(filter, sortField, sortDirection, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(entityResult => {
        this.entitiesSubject.next(entityResult.entities);
        this.totalSubject.next(entityResult.total);
        this.loadingSubject.next(false);
      });
  }

  public getTotal() {
    console.debug('Total requested ' + this.totalSubject.getValue());
    return this.totalSubject.getValue();
  }
}
