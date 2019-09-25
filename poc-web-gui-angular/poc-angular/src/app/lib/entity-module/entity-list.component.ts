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
import {ActionResult, EntityEditorActionsComponent} from "./table-row-editor/entity-editor-actions.component";


export interface EditorViewState {
  rowElement: HTMLElement,
  rowIndex: number,
  transform: string
}

export interface Position {
  x: string,
  y: string
}

export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() isManaged: boolean = false;
  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  dataSource: EntityDataSource<T>;

  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  filterRowVisible: boolean = true;
  editorRowVisible: boolean = false;

  displayedColumns: string[];

  contextMenuPosition: Position = {x: '0px', y: '0px'};

  editorViewState: EditorViewState = {
    rowElement: null,
    rowIndex: null,
    transform: 'translateY(0)'
  };


  rowHeight: number = 31;

  @ViewChild(EntityEditorActionsComponent, {static: false}) editorActions: EntityEditorActionsComponent<T>;

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
          this.stopEditing();
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

  saveEntity(): void {
    console.debug('Save this ' + this.meta.displayName.toLowerCase());

    // Validate

    // Save the changes
    if (this.editorActions) {
      this.editorActions.saveEntity(this.editorRow.rowEditorForm);
    }
  }


  deleteEntity(entity: T): void {
    console.debug('Delete ' + this.meta.displayName);
    if (this.editorActions) {
      this.editorActions.deleteEntity(entity);
    }
  }


  updateEntities() {
    if (this.editorActions) {
      this.editorActions.updateEntities();
    }
  }


  deleteEntities() {
    if (this.editorActions) {
      this.editorActions.deleteEntities();
    }
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

    let patchEnity: Partial<T> = $event;
  }


  public startEditing(entity: T, targetElement: Element, idx: number) {

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

  public stopEditing() {
    this.checkForUnsavedChanges();
    this.hideAndResetEditorView();
    this.editorRow.loadEntity(null);
  }

  private checkForUnsavedChanges(): void {
    if (this.editorRow.rowEditorForm.dirty) {
      console.debug('The editor row has unsaved changes');
      const dialogRef = this.openConfirmationDialog('Unsaved changes', 'Do you want to save the changes?');
      dialogRef.afterClosed().subscribe(
        data => {
          if (data.confirmed) {
            console.info('User confirmed het wants to save changes');
            // TODO: Save the changes
          } else {
            console.info('User chose to discard changes in the editor');
          }
        }
      );
    } else {
      console.debug('The editor row doesn\'t have unsaved changes');
    }
  }

  private hideAndResetEditorView() {
    this.editorRowVisible = false;
    if (this.editorViewState.rowElement) {
      this.editorViewState.rowElement.style.opacity = '1';
      this.editorViewState.transform = 'translateY(0)';
      this.editorViewState.rowElement = null;
    }
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
    this.fieldFilters = $event;
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


  onActionResult(actionResult: ActionResult<T>) {
    if (actionResult.action == 'save') {
      this.editorRow.rowEditorForm.markAsPristine();
      this.stopEditing();
    } else if (actionResult.action == 'delete') {
      console.debug('Entity deleted');
    }
    this.loadEntitiesPage();
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
