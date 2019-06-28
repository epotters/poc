import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {PeopleService} from "../core/service";
import {Person} from "../core/domain";
import {catchError, finalize} from "rxjs/operators";
import {FilterSet} from "../common/filter.model";

export class PeopleDataSource implements DataSource<Person> {

  private peopleSubject = new BehaviorSubject<Person[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);

  constructor(private peopleService: PeopleService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Person[]> {
    console.debug('Connecting...');
    return this.peopleSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.debug('Disconnecting...');
    this.peopleSubject.complete();
    this.loadingSubject.complete();

    this.totalSubject.complete();
  }

  loadPeople(filter: FilterSet, sortField: string, sortDirection: string, pageNumber: number, pageSize: number) {
    console.debug('Loading people...');

    this.loadingSubject.next(true);


    this.peopleService.list(filter, sortField, sortDirection, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(peopleResult => {
        this.peopleSubject.next(peopleResult.people)
        this.totalSubject.next(peopleResult.total)
      });
  }
}
