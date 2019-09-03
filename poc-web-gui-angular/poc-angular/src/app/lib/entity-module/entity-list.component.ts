import {AfterViewInit, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatMenuTrigger} from "@angular/material/menu";

import {merge, of as observableOf} from "rxjs";
import {catchError, delay, map, startWith, switchMap} from "rxjs/operators";

import {FieldFilter} from "./domain/filter.model";
import {ColumnConfig, EntityMeta} from "./domain/entity-meta.model";
import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {FilterRowComponent} from "./table-filter/filter-row/filter-row.component";
import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";


export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() isManaged: boolean = false;
  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: EntityDataSource<T>;
  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  contextMenuPosition = {x: '0px', y: '0px'};

  @ViewChild(FilterRowComponent, {static: false}) filterRow: FilterRowComponent<T>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('contextMenuTrigger', {static: true}) contextMenuTrigger: MatMenuTrigger;

  protected constructor(
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

    this.dataSource.loadEntities(this.fieldFilters, this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.meta.defaultPageSize);
  }


  ngAfterViewInit(): void {

    // Reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    merge(this.sort.sortChange, this.paginator.page, this.filterRow.filterChange)
      .pipe(
        startWith({}),
        delay(0), // Workarond for "Expression has changed" error
        switchMap(() => {
          this.loadEntitiesPage();
          return this.dataSource.awaitEntities();
        }),
        map(() => {
          return this.dataSource.awaitEntities();
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(() => {
      }
    );
  }


  loadEntitiesPage() {
    this.dataSource.loadEntities(
      this.fieldFilters,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }


  public onFilterChanged($event) {
    console.debug('onFilterChanged: Event received');
    console.debug($event);
    this.fieldFilters = this.filtersAsArray($event);
  }


  public clearFilter() {
    this.filterRow.clearFilter();
  }


  private filtersAsArray(entityFilter: object): FieldFilter[] {
    let filtersArray: FieldFilter[] = [];
    if (this.filterRow) {
      Object.entries(entityFilter).forEach(
        ([key, value]) => {
          // console.log(key, value);
          if (value && value !== "") {
            let name: string = key.substring(0, (key.length - 'Filter'.length));
            filtersArray.push({
              name: name,
              rawValue: value
            })
          }
        }
      );
    } else {
      console.debug('No tableFilter yet');
    }
    return filtersArray;
  }

  selectEntity(entity): void {
    console.info(this.meta.displayName + ' selected: ', entity);
    if (this.isManaged) {
      this.entitySelector.emit(entity);
    } else {
      this.router.navigate([this.meta.apiBase + '/' + entity.id]);
    }
  }


  deleteEntity(entity): void {
    console.debug('Delete ' + this.meta.displayName);
  }


  public newEntity() {
    if (this.isManaged) {
      this.selectEntity(null);
    } else {
      this.router.navigate([this.meta.apiBase + '/new']);
    }
  }


  updateEntities() {
    const dialogRef = this.openConfirmationDialog('Confirm batch update',
      'Are you sure you want to update all selected ' + this.meta.displayNamePlural.toLowerCase() + '?');
    dialogRef.afterClosed().subscribe(
      data => {
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
        if (data.confirmed) {
          console.info('User confirmed batch delete action, so it will be executed');
        } else {
          console.info('User canceled batch delete action');
        }
      }
    );
  }


  onContextMenu(event: MouseEvent, entity: T) {

    console.debug('Context menu for entity ', entity);

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuTrigger.menuData = {'entity': entity};
    this.contextMenuTrigger.openMenu();
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


  getCellDisplayValue(entity: T, fieldName: string): string {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    let value = entity[fieldName];
    if (fieldName.indexOf('.')) {
      let fieldNameParts = fieldName.split('.');
      value = entity[fieldNameParts.shift()];
      for (let fieldNamePart of fieldNameParts) {
        value = value[fieldNamePart];
      }
    }
    if (columnConfig.renderer) {
      return columnConfig.renderer(value);
    }
    return value;
  }

}
