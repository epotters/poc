import {AfterViewInit, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatMenuTrigger} from "@angular/material/menu";

import {merge, Observable, of as observableOf} from "rxjs";
import {catchError, delay, map, startWith, switchMap} from "rxjs/operators";

import {FieldFilter} from "./domain/filter.model";
import {ColumnConfig, EntityMeta, SortDirectionType} from "./domain/entity-meta.model";

import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";
import {EditorRowComponent} from "./table-row-editor/editor-row.component";
import {FilterRowComponent} from "./table-row-editor/filter-row.component";
import {ActionResult, EntityEditorActionsComponent} from "./table-row-editor/entity-editor-actions.component";


export interface ListConfig<T> {
  title?: string;
  columns?: string[];
  overlay?: any;
  initialFilters?: FieldFilter[];
  initialSort?: string;
  initialSortDirection?: SortDirectionType;
  headerVisible?: boolean;
  paginatorVisible?: boolean;
  filterVisible?: boolean;
  editorVisible?: boolean;
}

export interface EditorViewState {
  rowElement: HTMLElement,
  rowIndex: number,
  transform: string
}

export interface DataSourceState {
  filter: FieldFilter[],
  sort: string;
  sortDirection: SortDirectionType,
  page: number;
  pageSize: number;
}

export interface Position {
  x: string,
  y: string
}

export abstract class EntityListComponent<T extends Identifiable> implements OnChanges, OnInit, AfterViewInit {

  @Input() isManaged: boolean = false;

  @Input() title: string = this.meta.displayName;
  @Input() columns: string[] = this.meta.displayedColumns;
  @Input() overlay: any = {};

  @Input() initialSort?: string = this.meta.defaultSortField || 'id';
  @Input() initialSortDirection?: SortDirectionType = this.meta.defaultSortDirection || 'asc';
  @Input() initialFilters: FieldFilter[] = [];

  @Input() headerVisible: boolean = true;
  @Input() paginatorVisible: boolean = true;
  @Input() filterVisible: boolean = true;
  @Input() editorVisible: boolean = false;

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();


  dataSource: EntityDataSource<T>;
  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  contextMenuPosition: Position = {x: '0px', y: '0px'};

  editorViewState: EditorViewState = {
    rowElement: null,
    rowIndex: null,
    transform: 'translateY(0)'
  };


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

    this.title = meta.displayNamePlural;

  }

  ngOnChanges(changes: SimpleChanges) {
    console.debug('EntityListComponent -', 'Input changed:', changes);
  }

  ngOnInit() {
    console.debug('Initializing the EntityListComponent for type ' + this.meta.displayNamePlural);

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

  }

  private applyInitialDataState(): void {

    this.fieldFilters = this.applyOverlay(this.initialFilters);
    this.filterRow.setFilters(this.fieldFilters);

    this.paginator.pageIndex = this.startPage;
    this.paginator.pageSize = this.meta.defaultPageSize;
  }

  ngAfterViewInit(): void {

    this.applyInitialDataState();

    // Reset the paginator after sorting
    this.sort.sortChange
      .subscribe(() => {
        this.paginator.pageIndex = 0;
      });

    merge(this.sort.sortChange, this.paginator.page, this.filterRow.editorChange)
      .pipe(
        startWith({}),
        delay(200), // Workarond for "Expression has changed" error
        switchMap(() => {
          this.stopEditing().subscribe();
          this.loadEntitiesPage();
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

    this.editorActions.saveEntity(this.editorRow.rowEditorForm, this.overlay)
      .subscribe((result: ActionResult<T>) => {
        if (result.success) {
          this.stopEditing().subscribe(result => {
            console.info(result.msg);
          });
          this.loadEntitiesPage();
        }
      });

  }

  onKeyEnter(): void {
    if (this.editorRow.rowEditorForm.dirty) {
      this.saveEntity();
    } else {
      this.stopEditing().subscribe();
    }
  }

  deleteEntity(entity: T): void {
    console.debug('Delete ' + this.meta.displayName);
    if (this.editorActions) {
      this.editorActions.deleteEntity(entity).subscribe((result: ActionResult<T>) => {
        if (result.success) {
          console.debug('Entity deleted');
          this.loadEntitiesPage();
        }

      });
    }
  }

  updateEntities() {
    if (this.editorActions) {
      this.editorActions.updateEntities();
    }
  }


  // Editor

  deleteEntities() {
    if (this.editorActions) {
      this.editorActions.deleteEntities();
    }
  }

  toggleEditor(): void {
    if (this.editorVisible) {
      this.stopEditing().subscribe();
    } else {
      this.editorVisible = true;
    }
  }

  public startEditing(entity: T, targetElement: Element, idx: number) {

    console.debug('Are we currently editing? ' + this.isEditing());
    console.debug('rowEditorForm value', this.editorRow.rowEditorForm.getRawValue());

    if (this.isEditing()) {
      this.stopEditing().subscribe((result: ActionResult<T>) => {
        if (result.success) {
          console.debug('Start editing...');
          this.showAndPositionEditor(targetElement, idx);
          this.editorRow.loadEntity(entity);
          if (result.changes) {
            this.loadEntitiesPage();
          }
        } else {
          console.debug('Failed to stop editing...', result.msg);
        }
      });
    } else {
      this.showAndPositionEditor(targetElement, idx);
      this.editorRow.loadEntity(entity);
    }
  }

  public stopEditing(): Observable<ActionResult<T>> {
    return this.editorActions.handleUnsavedChanges(this.editorRow.rowEditorForm, this.overlay)
      .pipe(map((result: ActionResult<T>) => {
        if (result.success) {
          this.editorRow.rowEditorForm.reset();
          this.hideAndResetEditor();
        }
        return result;
      }));
  }

  isEditing(): boolean {
    const form = this.editorRow.rowEditorForm;
    return (form.dirty ||
      (this.editorViewState.rowElement &&
        form.getRawValue() && form.getRawValue()['id'] && form.getRawValue()['id'] != null)
    );
  }

// Filters
  toggleFilter()
    :
    void {
    this.filterVisible = !this.filterVisible;
  }

  onFilterChanged($event)
    :
    void {
    console.debug('onFilterChanged', $event);
    this.fieldFilters = this.applyOverlay($event);
    console.debug('onFilterChanged, after appyOverlay', this.overlay, this.fieldFilters);
  }

// User actions
  onShiftClick(event: MouseEvent, entity: T) {
    if (event.shiftKey) {
      this.selectEntity(entity);
    }
  }

  onDblClick(event: MouseEvent, entity: T, idx: number) {
    console.debug('Double click on entity ', entity);
    event.preventDefault();
    const targetElement: Element = ((event.target || event.currentTarget) as Element);
    this.startEditing(entity, targetElement, idx);
  }

  onContextMenu(event: MouseEvent, entity: T, idx: number) {
    console.debug('Context menu for entity ', entity, 'idx: ' + idx);
    event.preventDefault();
    const targetElement: Element = ((event.target || event.currentTarget) as Element);

    let fieldName: string = this.fieldNameFromCellElement(targetElement);

    this.contextMenuPosition = {x: event.clientX + 'px', y: event.clientY + 'px'};
    this.contextMenuTrigger.menuData = {
      entity: entity,
      targetElement: targetElement,
      dataIndex: idx,
      columnConfig: this.meta.columnConfigs[fieldName]
    };

    if (this.isFieldRelatedEntity(fieldName)) {
      this.contextMenuTrigger.menuData.relatedEntity = fieldName;
    }

    this.contextMenuTrigger.openMenu();
  }

  goToManager() {
    this.router.navigate([this.meta.namePlural, 'manager']);
  }

  goToRelatedEntity(fieldName: string, entity: Identifiable) {
    this.router.navigate([this.meta.columnConfigs[fieldName].editor.relatedEntity.namePlural, entity.id]);
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

  private showAndPositionEditor(targetElement: Element, idx: number) {
    this.editorVisible = true;
    this.editorViewState.rowElement = (targetElement.parentElement as HTMLElement);
    this.editorViewState.transform = 'translateY(' + (idx * this.editorViewState.rowElement.offsetHeight) + 'px)';
    this.editorViewState.rowElement.style.opacity = '0.5';
  }

  private hideAndResetEditor() {
    this.editorVisible = false;
    if (this.editorViewState.rowElement) {
      this.editorViewState.rowElement.style.opacity = '1';
      this.editorViewState.rowElement = null;
    }
    this.editorViewState.transform = 'translateY(0)';
  }

  private isFieldRelatedEntity(fieldName: string): boolean {
    let config = this.meta.columnConfigs[fieldName];
    return (config.editor && !!config.editor.relatedEntity);
  }

  private fieldNameFromCellElement(cellElement: Element): string {
    let classes: string[] = cellElement.getAttribute('class').split(' ');
    for (let idx in classes) {
      let cls = classes[idx];
      if (cls.startsWith('mat-column-')) {
        return cls.split('-')[2];
      }
    }
    return '';
  }

  private applyOverlay(filters: FieldFilter[]): FieldFilter[] {
    const newFieldFilters: FieldFilter[] = [];
    for (let idx in Reflect.ownKeys(this.overlay)) {
      let key = (Reflect.ownKeys(this.overlay)[idx] as string);
      console.debug('-> applyOverlay', key, this.overlay[key]);
      if (this.overlay[key]['id']) {
        newFieldFilters.push({name: key + '.id', rawValue: this.overlay[key]['id']});
      } else {
        newFieldFilters.push({name: key, rawValue: this.overlay[key]});
      }
    }
    for (let idx in filters) {
      let fieldFilter: FieldFilter = filters[idx];
      if (!Reflect.ownKeys(this.overlay).includes(fieldFilter.name)) {
        newFieldFilters.push(fieldFilter);
      }
    }
    return newFieldFilters;
  }


  onAnimationEvent(event: AnimationEvent) {
    console.debug('---> EntityListComponent - AnimationEvent', event);
  }
}
