import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {Identifiable} from './domain/identifiable.model';
import {EntityDataSource} from './entity-data-source';


@Component({
  selector: 'entity-relative-navigation',
  templateUrl: 'entity-relative-navigation.component.html'
})
export class EntityRelativeNavigationComponent<T extends Identifiable> implements OnInit, OnDestroy {

  @Input() dataSource: EntityDataSource<T>;
  @Input() selectedEntity: BehaviorSubject<T | null>;
  @Input() paginator: MatPaginator;

  public stayOnSamePage: boolean = true;

  private terminator: Subject<any> = new Subject();

  private currentIdx: number = -1;
  private currentAbsoluteIdx: number = -1;
  public hasNext: boolean = false;
  private hasNextOnNextPage: boolean = false;
  public hasPrevious: boolean = false;
  private hasPreviousOnPreviousPage: boolean = false;

  constructor() {
  }

  ngOnInit() {

    this.selectedEntity.pipe(takeUntil(this.terminator)).subscribe((entity: T | null) => {
      this.currentIdx = this.getCurrentIndex(entity);
      this.currentAbsoluteIdx = this.getAbsoluteIndex();
      this.setNext();
      this.setPrevious();

      console.debug(`Last: ${this.dataSource.entitiesSubject.getValue().length - 1}, Current entity index: ${this.currentIdx}, total: ${this.dataSource.totalSubject.getValue()}, hasNext: ${this.hasNext}`);


    });
  }

  ngOnDestroy() {
    this.terminator.next();
    this.terminator.complete();
  }

  selectNext() {
    console.debug('Select the next entity');
    if (this.hasNext) {
      if (this.stayOnSamePage && !this.hasNextOnNextPage) {
        const entities: T[] = this.dataSource.entitiesSubject.getValue();
        this.selectedEntity.next(entities[this.currentIdx + 1]);
      } else if (!this.stayOnSamePage && this.hasNextOnNextPage) {
        this.selectEntityWhenItArrives(false);
        this.paginator.nextPage();
      }
    } else {
      console.debug('No next entity found');
    }
  }


  selectPrevious() {
    console.debug('Select the previous entity');
    if (this.hasPrevious) {
      if (this.stayOnSamePage && !this.hasPreviousOnPreviousPage) {
        const entities: T[] = this.dataSource.entitiesSubject.getValue();
        this.selectedEntity.next(entities[this.currentIdx - 1]);
      } else if (!this.stayOnSamePage && this.hasPreviousOnPreviousPage) {
        this.selectEntityWhenItArrives(true);
        this.paginator.previousPage();
      } else {
        console.debug('No previous entity found');
      }
    }
  }

  private selectEntityWhenItArrives(last: boolean) {
    console.debug('selectEntityWhenItArrives');
    combineLatest([this.paginator.page, this.dataSource.entitiesSubject]).pipe(
      map(([pageEvent, entities]) => ({pageEvent, entities}))
    ).pipe(take(1)).subscribe((pair) => {
      console.debug('pageEvent:', pair.pageEvent);
      console.debug('entities:', pair.entities);
      const idx = (last) ? pair.entities.length - 1 : 0;
      this.selectedEntity.next(pair.entities[idx]);
    });
  }

  private setNext() {
    if (this.currentIdx > -1) {
      if (this.currentIdx < this.dataSource.entitiesSubject.getValue().length - 1) {
        this.hasNext = true;
      } else {
        this.hasNext = (this.stayOnSamePage) ? false : this.paginator.hasNextPage();
        this.hasNextOnNextPage = this.paginator.hasNextPage();
      }
    } else {
      this.hasNext = false;
    }
  }

  private setPrevious() {
    if (this.currentIdx > -1) {
      if (this.currentIdx > 0) {
        this.hasPrevious = true;
      } else {
        this.hasPrevious = (this.stayOnSamePage) ? false : this.paginator.hasPreviousPage();
        this.hasPreviousOnPreviousPage = this.hasPrevious;
      }
    } else {
      this.hasPrevious = false;
    }
  }

  private getCurrentIndex(currentEntity: T | null): number {
    const entities: T[] = this.dataSource.entitiesSubject.getValue();
    return (!!currentEntity) ? entities.findIndex((entity: T) => entity.id === currentEntity.id) : -1;
  }

  private getAbsoluteIndex() {
    return this.paginator.pageIndex * this.paginator.pageSize + this.currentIdx;
  }
}
