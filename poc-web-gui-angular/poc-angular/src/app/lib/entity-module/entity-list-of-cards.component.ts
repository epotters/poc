import {AfterViewInit, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";

import {EntityMeta} from "./domain/entity-meta.model";
import {FilterSet} from "./domain/filter.model";
import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";


export abstract class EntityListOfCardsComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: EntityDataSource<T>;

  total: number = 0;
  filters: FilterSet = {
    filters: []
  };
  startPage: number = 0;

  @ViewChild('filter', {static: true}) filterField: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    console.debug('Constructing the EntityListOfCardsComponent for type ' + this.meta.displayNamePlural);
  }


  ngOnInit() {
    console.debug('Initializing the EntityListOfCardsComponent for type ' + this.meta.displayNamePlural);

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

    this.dataSource.loadEntities(this.filters, this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.meta.defaultPageSize);
  }


  ngAfterViewInit(): void {

    // Server-side search
    fromEvent(this.filterField.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.buildFilters(this.filterField.nativeElement.value);
          this.paginator.pageIndex = 0;
          this.loadEntitiesPage();
        })
      )
      .subscribe();


    // Reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadEntitiesPage();
          this.total = this.dataSource.getTotal();
        })
      )
      .subscribe();
  }


  loadEntitiesPage() {
    this.dataSource.loadEntities(
      this.filters,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }


  selectEntity(entity): void {
    console.info(this.meta.displayName + ' selected: ', entity);
    this.entitySelector.emit(entity);
  }


  private buildFilters(term: string): void {
    this.filters.filters = [{name: this.meta.defaultFilterField, value: term}];
  }


  newEntity() {
    this.selectEntity(null);
  }


}
