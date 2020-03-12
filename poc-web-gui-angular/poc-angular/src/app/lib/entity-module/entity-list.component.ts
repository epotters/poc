import {AfterViewInit, Directive, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatMenuTrigger} from "@angular/material/menu";

import {merge, Observable, of as observableOf} from "rxjs";
import {catchError, delay, map, startWith, switchMap} from "rxjs/operators";

import {FieldFilter} from "./domain/filter.model";
import {ColumnConfig, EntityMeta, RelatedEntity, SortDirectionType} from "./domain/entity-meta.model";

import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";
import {EditorRowComponent} from "./table-row-editor/editor-row.component";
import {FilterRowComponent} from "./table-row-editor/filter-row.component";
import {ActionResult, EntityEditorActionsComponent} from "./table-row-editor/entity-editor-actions.component";
import {Identifiable} from "./domain/identifiable.model";


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


export interface EditableListConfig<T> extends ListConfig<T> {
  editorVisible?: boolean;
}

export interface EditorViewState {
  rowElement?: HTMLElement,
  rowIndex?: number,
  transform: string
}

@Directive()
export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() isManaged: boolean = false;

  @Input() title: string = this.meta.displayNamePlural;
  @Input() columns: string[] = this.meta.displayedColumns;
  @Input() overlay: any = {};

  @Input() initialSort?: string = this.meta.defaultSortField || 'id';
  @Input() initialSortDirection?: SortDirectionType = this.meta.defaultSortDirection || 'asc';
  @Input() initialFilters: FieldFilter[] = [];

  @Input() headerVisible: boolean = true;
  @Input() paginatorVisible: boolean = true;
  @Input() filterVisible: boolean = true;

  @Input() editorVisible: boolean = false;

  @Output() selectedEntity: EventEmitter<T> = new EventEmitter<T>();

  selectedClass: string = 'selected';

  dataSource: EntityDataSource<T>;
  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  contextMenuPosition: Position = {x: '0px', y: '0px'};

  editable: boolean = true;

  editorViewState: EditorViewState = {
    rowElement: undefined,
    rowIndex: undefined,
    transform: 'translateY(0)'
  };

  @ViewChild(EntityEditorActionsComponent) editorActions: EntityEditorActionsComponent<T>;
  @ViewChild(EditorRowComponent) editorRow: EditorRowComponent<T>;

  @ViewChild(FilterRowComponent) filterRow: FilterRowComponent<T>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;

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

  ngOnInit() {
    console.debug('Initializing the EntityListComponent for type ' + this.meta.displayNamePlural);
    this.dataSource = new EntityDataSource<T>(this.meta, this.service);
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
          this.stopEditing().subscribe(); // editable only
          this.loadEntitiesPage();
          return this.dataSource.entities$;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(() => {
      }
    );
  }

  private applyInitialDataState(): void {
    this.fieldFilters = this.applyOverlay(this.initialFilters);
    this.filterRow.setFilters(this.fieldFilters);
    this.paginator.pageIndex = this.startPage;
    this.paginator.pageSize = this.meta.defaultPageSize;
  }

  selectEntity(entity?: T): void {
    console.info(`${this.meta.displayName} selected: `, entity);
    if (this.isManaged) {
      this.selectedEntity.emit(entity);
    } else if (!!entity) {
      this.router.navigate([this.meta.namePlural + '/' + entity.id]);
    }
  }


  loadEntitiesPage(): void {
    this.dataSource.loadEntities(
      this.fieldFilters,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }


  // Filters
  toggleFilter(): void {
    this.filterVisible = !this.filterVisible;
  }

  onFilterChanged($event): void {
    console.debug('onFilterChanged', $event);
    this.fieldFilters = this.applyOverlay($event);
    console.debug('onFilterChanged, after appyOverlay', this.overlay, this.fieldFilters);
  }

  // User actions
  onClick(event: MouseEvent, entity: T) {

    let targetElement: Element = ((event.target || event.currentTarget) as Element);
    let row: Element | null = targetElement.parentElement;
    if (!!row) {
      let table: Element | null = row.parentElement;
      if (!!table) {
        let previousRow: Element | null = table.querySelector('.' + this.selectedClass);
        if (!!previousRow) {
          previousRow.classList.remove(this.selectedClass);
        }
      }
      row.classList.add(this.selectedClass);
    }

    let fieldName: string = EntityListComponent.fieldNameFromCellElement(targetElement);
    if (this.isFieldRelatedEntity(fieldName)) {
      this.goToRelatedEntity(fieldName, entity[fieldName]);
    }

    if (event.shiftKey) {
      console.debug('onShiftClick');
      this.selectEntity(entity);
    }
  }

  onContextMenu(event: MouseEvent, entity: T, idx: number) {
    console.debug('Context menu for entity ', entity, 'idx: ' + idx);
    event.preventDefault();
    const targetElement: Element = ((event.target || event.currentTarget) as Element);

    let fieldName: string = EntityListComponent.fieldNameFromCellElement(targetElement);

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


  onMouseEnter(event: MouseEvent, entity: T) {
    const targetElement: Element = ((event.target || event.currentTarget) as Element);
    targetElement.classList.add('related-entity-link');
  }

  onMouseLeave(event: MouseEvent, entity: T) {
    const targetElement: Element = ((event.target || event.currentTarget) as Element);
    targetElement.classList.remove('related-entity-link');
  }

  goToManager() {
    this.router.navigate([this.meta.namePlural, 'manager']);
  }

  goToRelatedEntity(fieldName: string, entity: Identifiable) {
    const columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    const relatedEntity: RelatedEntity | undefined = (!!columnConfig && !!columnConfig.editor) ? columnConfig.editor.relatedEntity : undefined;
    if (!!relatedEntity) {
      this.router.navigate([relatedEntity.namePlural, entity.id]);
    }
  }

  getCellDisplayValue(entity: T, fieldName: string): string {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    let value = entity[fieldName];
    if (fieldName.indexOf('.')) {
      let fieldNameParts: string[] = fieldName.split('.');
      let key: string | undefined = fieldNameParts.shift();
      if (!!key) {
        value = entity[key];
        for (let fieldNamePart of fieldNameParts) {
          value = value[fieldNamePart];
        }
      }
    }
    if (columnConfig.renderer) {
      return columnConfig.renderer(entity, value);
    }
    return value;
  }

  private isFieldRelatedEntity(fieldName: string): boolean {
    let config = this.meta.columnConfigs[fieldName];
    return (!!config.editor && !!config.editor.relatedEntity);
  }

  private static fieldNameFromCellElement(cellElement: Element): string {
    let fieldName: string = '';
    cellElement.classList.forEach((className) => {
      if (className.startsWith('mat-column-')) {
        fieldName = className.split('-')[2];
      }
    });
    return fieldName;
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
    // console.debug('---> EntityListComponent - AnimationEvent', event);
  }


  // From here: Editable mode only

  public newEntity() {
    if (this.isManaged) {
      this.selectEntity(undefined);
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

  isSaveable() {
    if (!!this.editorRow && !!this.editorRow.rowEditorForm) {
      // console.debug('isEditing:', this.isEditing(), 'dirty:', this.editorRow.rowEditorForm.dirty, 'invalid:', this.editorRow.rowEditorForm.invalid);
      return (this.isEditing() && this.editorRow.rowEditorForm.dirty && !this.editorRow.rowEditorForm.invalid);
    } else {
      return false;
    }
  }

  checkAndSave(): void {
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

  deleteEntities() {
    if (this.editorActions) {
      this.editorActions.deleteEntities();
    }
  }

  // Editor Row

  toggleEditor(): void {
    if (this.editorVisible) {
      this.stopEditing().subscribe();
    } else {
      this.editorVisible = true;
    }
  }

  public startEditing(entity: T, targetElement: Element, idx: number) {
    console.debug('Are we currently editing? ' + this.isEditing());
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
      console.debug('Not editing yet, start at row ' + idx);
      this.showAndPositionEditor(targetElement, idx);
      this.editorRow.loadEntity(entity);
    }
  }

  public stopEditing(): Observable<ActionResult<T>> {
    return this.editorActions.handleUnsavedChanges(this.editorRow.rowEditorForm, this.overlay)
      .pipe(map((result: ActionResult<T>) => {
        if (result.success) {
          this.editorRow.rowEditorForm.reset();
          this.editorRow.rowEditorForm.markAsPristine();
          this.hideAndResetEditor();
        }
        return result;
      }));
  }

  isEditing(): boolean {
    const form = this.editorRow.rowEditorForm;
    return (form.dirty ||
      (!!this.editorViewState.rowElement &&
        !!form.getRawValue() && !!form.getRawValue()['id'] && form.getRawValue()['id'] != null)
    );
  }

  onKeyEnter(): void {
    this.checkAndSave();
  }

  onDblClick(event: MouseEvent, entity: T, idx: number) {
    console.debug('Double click on entity ', entity);
    event.preventDefault();
    const targetElement: Element = ((event.target || event.currentTarget) as Element);
    this.startEditing(entity, targetElement, idx);
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
      this.editorViewState.rowElement = undefined;
    }
    this.editorViewState.transform = 'translateY(0)';
  }

}
