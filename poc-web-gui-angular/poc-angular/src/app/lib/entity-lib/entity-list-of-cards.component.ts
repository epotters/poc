import {
  AfterViewInit,
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {ComponentLoader} from './common/component-loader/component-loader';
import {EntityComponentEntryPointDirective} from './common/component-loader/entity-component-entrypoint.directive';

import {EntityMeta, SortDirectionType} from './domain/entity-meta.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityDataSource} from './entity-data-source';
import {EntityEditorComponent} from './entity-editor.component';
import {EntityService} from './entity.service';


@Directive()
export abstract class EntityListOfCardsComponent<T extends Identifiable> implements OnInit, AfterViewInit, OnDestroy {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  @Input() dataSource: EntityDataSource<T>;

  @Input() activeSort: string = 'id';
  @Input() sortDirection: SortDirectionType = 'asc';
  @Input() pageSize: number = 2;
  startPage: number = 0;

  private terminator: Subject<any> = new Subject();

  component: Type<any>;
  componentRef: ComponentRef<EntityEditorComponent<T>>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(EntityComponentEntryPointDirective, {static: true}) componentEntrypoint: EntityComponentEntryPointDirective;


  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public componentLoader: ComponentLoader<T>
  ) {
    console.debug(`Constructing the EntityListOfCardsComponent for type ${this.meta.displayNamePlural}`);
  }


  ngOnInit() {
    console.debug(`Initializing the EntityListOfCardsComponent for type ${this.meta.displayNamePlural}`);

    this.activeSort = this.meta.defaultSortField;
    this.sortDirection = this.meta.defaultSortDirection;

    if (!this.dataSource) {
      this.dataSource = new EntityDataSource<T>(this.meta, this.service);
    }

    this.dataSource.loadEntities([], this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.pageSize);
  }


  ngAfterViewInit(): void {

    this.paginator.page.pipe(
      tap(() => {
        this.loadEntitiesPage();
      })
    ).pipe(takeUntil(this.terminator)).subscribe();
  }


  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.terminator.next();
    this.terminator.complete();
  }


  loadEntitiesPage() {
    this.dataSource.loadEntities(
      [],
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
