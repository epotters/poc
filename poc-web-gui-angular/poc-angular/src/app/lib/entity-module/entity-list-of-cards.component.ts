import {AfterViewInit, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge} from "rxjs";
import {tap} from "rxjs/operators";

import {EntityMeta} from "./domain/entity-meta.model";
import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";


export abstract class EntityListOfCardsComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  @Input() activeSort: string = 'id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() pageSize: number = 2;
  startPage: number = 0;

  dataSource: EntityDataSource<T>;

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

    this.activeSort = this.meta.defaultSortField;
    this.sortDirection = this.meta.defaultSortDirection;

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

    this.dataSource.loadEntities(null, this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.pageSize);
  }


  ngAfterViewInit(): void {

    merge(this.paginator.page)
      .pipe(
        tap(() => {
          this.loadEntitiesPage();
        })
      )
      .subscribe();
  }


  loadEntitiesPage() {
    this.dataSource.loadEntities(
      null,
      this.activeSort,
      this.sortDirection,
      this.paginator.pageIndex,
      this.pageSize
    );
  }


  selectEntity(entity): void {
    console.info(this.meta.displayName + ' selected: ', entity);
    this.entitySelector.emit(entity);
  }
}
