import {AfterViewInit, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {FilterSet} from "./domain/filter.model";

import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {EntityService} from "./entity.service";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityDataSource} from "./entity-data-source";


export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  dataSource: EntityDataSource<T>;

  total: number = 0;
  filters: FilterSet = {
    filters: []
  };
  startPage: number = 0;

  @ViewChild('input', {static: true}) input: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    console.debug('Constructing the EntityListComponent for type ' + this.meta.displayNamePlural);
  }


  ngOnInit() {
    console.debug('Initializing the EntityListComponent for type ' + this.meta.displayNamePlural);

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

    this.dataSource.loadEntities(this.filters, this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.meta.defaultPageSize);
  }


  ngAfterViewInit(): void {

    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
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


  updateEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm batch update',
      'Are you sure you want to update all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');
    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed batch update action, so ik will be executed');
        } else {
          console.info('User canceled update action');
        }
      }
    );
  }


  deleteEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm deletion',
      'Are you sure you want to delete all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');
    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed batch delete action, so it will be executed');
        } else {
          console.info('User canceled batch delete action');
        }
      }
    );
  }


  openConfirmationDialog(title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: title,
      message: message
    };
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }


  private onRowClicked(entity): void {
    console.info(this.meta.displayName + ' clicked: ', entity);
    this.router.navigate([this.meta.namePlural + '/' + entity.id]);
  }



  // Relative navigation

  public isFirstEntity(currentEntityId: number): boolean {
    if (this.paginator.hasPreviousPage()) {
      let firstEntity: T = this.getByPosition(this.dataSource.getEntities(), 0);
      return (firstEntity.id === currentEntityId);
    }
    return false;
  }

  public isLastEntity(currentEntityId: number): boolean {
    if (!this.paginator.hasNextPage()) {
      let lastPageLength: number = this.paginator.length % this.paginator.pageSize;
      let lastEntity = this.getByPosition(this.dataSource.getEntities(), lastPageLength - 1);
      return (lastEntity.id === currentEntityId);
    }
    return false;
  }

  private positionOnCurrentPage(currentEntityId: number): number {
    let entities = this.dataSource.getEntities();
    let idx: number = -1;
    for (let entity of entities) {
      if (entity.id === currentEntityId) {
        break;
      }
      idx++;
    }
    return idx;
  }


  private getByPosition(entities: T[], idx: number): T {
    let currentIdx: number = 0;
    for (let entity of entities) {
      if (currentIdx == idx) {
        return entity;
      }
      idx++;
    }
    return null;
  }


  public getNextEntityId(currentEntityId: number): number {
    let entities = this.dataSource.getEntities();
    let idx: number = 0;
    let currentFound: boolean = false;
    for (let entity of entities) {
      if (currentFound) {
        return entity.id;
      }
      if (entity.id == currentEntityId) {
        currentFound = true;

        if (idx != entities.length - 1) {
          this.paginator.nextPage();
        }
      }
      idx++;
    }
  }

  public getPreviousEntityId(currentEntityId: number): number {
    let entities = this.dataSource.getEntities();
    let previousEntity: T;
    for (let entity of entities) {
      if (entity.id == currentEntityId) {
        if (previousEntity !== null) {
          return previousEntity.id;
        }
      }
      previousEntity = entity;
    }
  }

}
