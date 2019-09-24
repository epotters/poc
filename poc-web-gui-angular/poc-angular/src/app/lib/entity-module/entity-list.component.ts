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

import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";
import {EditorRowComponent} from "./table-row-editor/editor-row.component";
import {FilterRowComponent} from "./table-row-editor/filter-row.component";


export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() isManaged: boolean = false;
  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: EntityDataSource<T>;

  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  filterRowVisible: boolean = true;
  editorRowVisible: boolean = false;

  displayedColumns: string[];

  fieldSuffix: string = 'Filter';
  contextMenuPosition = {x: '0px', y: '0px'};

  editorViewState: any = {
    rowElement: null,
    rowIndex: null,
    transform: 'translateY(0)'
  };


  rowHeight: number = 31;

  @ViewChild(EditorRowComponent, {static: false}) editorRow: EditorRowComponent<T>;
  @ViewChild(FilterRowComponent, {static: false}) filterRow: FilterRowComponent<T>;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('contextMenuTrigger', {static: false}) contextMenuTrigger: MatMenuTrigger;


  protected constructor(
    public meta: EntityMeta<T>,
    public service: EntityService<T>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    console.debug('Constructing the EntityListComponent for type ' + this.meta.displayNamePlural);
    this.displayedColumns = meta.displayedColumns;
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

    merge(this.sort.sortChange, this.paginator.page, this.filterRow.editorChange)
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


  // CRUD
  loadEntitiesPage() {
    this.dataSource.loadEntities(
      this.fieldFilters,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }


  selectEntity(entity: T): void {
    console.info(this.meta.displayName + ' selected: ', entity);
    if (this.isManaged) {
      this.entitySelector.emit(entity);
    } else {
      // this.router.navigate([this.meta.apiBase + '/' + entity.id]);
      this.router.navigate([this.meta.namePlural + '/' + entity.id]);
    }
  }


  public newEntity() {
    if (this.isManaged) {
      this.selectEntity(null);
    } else {
      this.router.navigate([this.meta.apiBase + '/new']);
    }
  }


  deleteEntity(entity: T): void {
    console.debug('Delete ' + this.meta.displayName);
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


  // Editor

  toggleEditor(): void {
    this.editorRowVisible = !this.editorRowVisible;
  }

  public onEditorChanged($event): void {
    console.debug('onEditorChanged: Event received');
    console.debug($event);
    // Validate the entity
    // Save the entity
  }


  saveEntity(): void {
    console.debug('Save this ' + this.meta.displayName.toLowerCase());

    // Validate

    // Update the list
    this.dataSource.updateEntity(this.editorRow.rowEditorForm.getRawValue(), this.editorViewState.rowIndex);

    // Save

    // Reset the editor
    this.stopEditing();
  }

  startEditing(entity: T, targetElement: Element, idx: number) {

    console.debug('Are we currently editing? ' + this.isEditing());
    console.debug(this.editorRow.rowEditorForm.getRawValue());

    if (this.isEditing()) {
      this.stopEditing();
    }

    this.editorRowVisible = true;
    this.editorViewState.rowElement = (targetElement.parentElement as HTMLElement);
    this.editorViewState.transform = 'translateY(' + (idx * this.rowHeight) + 'px)';
    this.editorViewState.rowElement.style.opacity = '0.5';

    this.editorRow.loadEntity(entity);
  }

  stopEditing() {
    this.editorRowVisible = false;
    if (this.editorViewState.rowElement) {
      this.editorViewState.rowElement.style.opacity = '1';
      this.editorViewState.transform = 'translateY(0)';
      this.editorViewState.rowElement = null;
    }
    this.editorRow.loadEntity(null);
  }

  isEditing(): boolean {
    if (this.editorViewState.rowElement) {
      if (this.editorRow.rowEditorForm.getRawValue() && this.editorRow.rowEditorForm.getRawValue()['id']) {
        return this.editorRow.rowEditorForm.getRawValue()['id'] != null;
      }
    }
    return false;
  }


  // Filters

  toggleFilter(): void {
    this.filterRowVisible = !this.filterRowVisible;
  }

  public onFilterChanged($event): void {
    console.debug('onFilterChanged: Event received');
    console.debug($event);
    this.fieldFilters = this.filtersAsArray($event);
  }


  private filtersAsArray(entityFilter: object): FieldFilter[] {
    console.debug('entityFilter as JSON: ' + JSON.stringify(entityFilter));
    let filtersArray: FieldFilter[] = [];
    if (this.filterRow) {
      Object.entries(entityFilter).forEach(
        ([key, value]) => {
          if (value && value !== "") {
            let name: string = key.substring(0, (key.length - this.fieldSuffix.length));
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
    console.debug('filtersArray as JSON: ' + JSON.stringify(filtersArray));
    return filtersArray;
  }


  onShiftClick(event: MouseEvent, entity: T) {
    if (event.shiftKey) {
      this.selectEntity(entity);
    }
  }


  onContextMenu(event: MouseEvent, entity: T, idx: number) {
    console.debug('Context menu for entity ', entity);
    event.preventDefault();
    const target: EventTarget = event.target || event.srcElement || event.currentTarget;
    const targetElement: Element = (target as Element);
    console.debug(targetElement);

    console.debug('idx: ' + idx);

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuTrigger.menuData = {
      entity: entity,
      targetElement: targetElement,
      dataIndex: idx
    };
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


  goToManager() {
    this.router.navigate([this.meta.namePlural, 'manager']);
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
      return columnConfig.renderer(entity, value);
    }
    return value;
  }

}
