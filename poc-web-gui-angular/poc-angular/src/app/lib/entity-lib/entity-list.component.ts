import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {BehaviorSubject, merge, Observable, of as observableOf, Subject} from 'rxjs';
import {catchError, delay, map, startWith, switchMap, take, takeUntil} from 'rxjs/operators';

import {ColumnConfig, EntityMeta, RelatedEntity, SortDirectionType} from './domain/entity-meta.model';
import {FieldFilter} from './domain/filter.model';
import {Identifiable} from './domain/identifiable.model';
import {EntityDataSource} from './entity-data-source';
import {EntityService} from './entity.service';
import {EditorRowComponent} from './table-row-editor/editor-row.component';
import {ActionResult, EntityEditorActionsComponent} from './table-row-editor/entity-editor-actions.component';
import {FilterRowComponent} from './table-row-editor/filter-row.component';


export interface ListConfig<T> {
  title?: string;
  columns?: string[];
  overlay?: any;
  initialFilters?: FieldFilter[];
  initialSort?: string;
  initialSortDirection?: SortDirectionType;
  toolbarVisible?: boolean;
  headerVisible?: boolean;
  paginatorVisible?: boolean;
  filterVisible?: boolean;
  isManaged?: boolean;
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
export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit, OnDestroy {

  @Input() title: string = this.meta.displayNamePlural;
  @Input() columns: string[] = this.meta.displayedColumns;
  @Input() overlay: any = {};

  @Input() initialSort?: string = this.meta.defaultSortField || 'id';
  @Input() initialSortDirection?: SortDirectionType = this.meta.defaultSortDirection || 'asc';
  @Input() initialFilters: FieldFilter[] = [];

  @Input() toolbarVisible: boolean = true;
  @Input() headerVisible: boolean = true;
  @Input() paginatorVisible: boolean = true;
  @Input() filterVisible: boolean = true;
  @Input() editorVisible: boolean = false;

  @Input() isManaged: boolean = false;
  @Input() selectedEntity: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  @Input() dataSource: EntityDataSource<T>;

  private terminator: Subject<any> = new Subject();
  private dataChanged: Subject<any> = new Subject();


  readonly selectedClass: string = 'selected';

  editable: boolean = true;

  fieldFilters: FieldFilter[] = [];
  startPage: number = 0;

  contextMenuPosition: Position = {x: '0px', y: '0px'};

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
    renderer: Renderer2,
    public el: ElementRef
  ) {
    console.debug(`Constructing the EntityListComponent for type ${this.meta.displayNamePlural}`);

    this.title = meta.displayNamePlural;
  }

  ngOnInit() {
    console.debug(`Initializing the EntityListComponent for type ${this.meta.displayNamePlural}`);

    if (!this.dataSource) {
      console.debug('No input datasource provided, creating a new one');
      this.dataSource = new EntityDataSource<T>(this.meta, this.service);
    }
  }

  ngAfterViewInit(): void {

    this.applyInitialDataState();

    // Reset the paginator after sorting
    this.sort.sortChange.pipe(takeUntil(this.terminator))
      .subscribe(() => {
        this.paginator.pageIndex = 0;
      });

    merge(this.sort.sortChange, this.paginator.page, this.filterRow.editorChange, this.dataChanged)
      .pipe(
        startWith({}),
        delay(200), // Workarond for "Expression has changed" error
        switchMap(() => {
          this.justStopEditing(); // editable only
          this.loadEntitiesPage();
          return this.dataSource.entitiesSubject.asObservable();
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).pipe(takeUntil(this.terminator)).subscribe(() => {
      }
    );

    this.selectedEntity.pipe(takeUntil(this.terminator)).subscribe((entity: T | null) => {
      if (!!entity) {
        this.markSelectedRow();
      } else {
        this.unmarkSelectedRow();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataChanged.complete();
    this.terminator.next();
    this.terminator.complete();
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

  private applyInitialDataState(): void {
    this.fieldFilters = this.applyOverlay(this.initialFilters);
    this.filterRow.setFilters(this.fieldFilters);
    this.paginator.pageIndex = this.startPage;
    this.paginator.pageSize = this.meta.defaultPageSize;
  }

  selectEntity(entity: T | null): void {
    console.info(`${this.meta.displayName} selected: `, entity);
    if (this.isManaged) {
      this.selectedEntity.next(entity);
    } else if (!!entity) {
      this.goToEntityEditor(entity);
    }
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
  onClick(event: MouseEvent, entity: T, idx: number) {
    let cellElement: Element = EntityListComponent.getCellClicked(event);
    const fieldName: string = EntityListComponent.fieldNameFromCellElement(cellElement);
    if (this.isFieldRelatedEntity(fieldName)) {
      this.goToRelatedEntity(fieldName, entity[fieldName]);
    }
    if (this.isManaged || event.shiftKey) {
      this.selectEntity(entity);
    }
    if (this.isEditing() && this.editorViewState!.rowIndex != idx) {
      this.startEditing(entity, (cellElement.parentNode as Element), idx);
    }
  }

  onContextMenu(event: MouseEvent, entity: T, idx: number) {
    console.debug('Context menu for entity ', entity, 'idx: ' + idx);
    event.preventDefault();
    let cellElement: Element = EntityListComponent.getCellClicked(event);
    const fieldName: string = EntityListComponent.fieldNameFromCellElement(cellElement);
    this.contextMenuPosition = {x: event.clientX + 'px', y: event.clientY + 'px'};
    this.contextMenuTrigger.menuData = {
      entity: entity,
      targetElement: cellElement,
      dataIndex: idx,
      columnConfig: this.meta.columnConfigs[fieldName]
    };
    if (this.isFieldRelatedEntity(fieldName)) {
      this.contextMenuTrigger.menuData.relatedEntity = fieldName;
    }
    this.contextMenuTrigger.openMenu();
  }

  // Navigation
  goToEntityEditor(entity: T) {
    this.router.navigate([this.meta.namePlural + '/' + entity.id]);
  }

  goToEmptyEditor() {
    this.router.navigate([this.meta.apiBase + '/new']);
  }

  goToManager() {
    this.router.navigate([this.meta.namePlural, 'manager']);
  }

  goToRelatedEntity(fieldName: string, entity: Identifiable) {
    const columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    const relatedEntity: RelatedEntity | undefined = this.getRelatedEntity(columnConfig);
    if (!!relatedEntity) {
      this.router.navigate([relatedEntity.namePlural, entity.id]);
    }
  }

  getRelatedEntity(columnConfig: ColumnConfig): RelatedEntity | undefined {
    return (!!columnConfig && !!columnConfig.editor) ? columnConfig.editor.relatedEntity : undefined;
  }

  private isFieldRelatedEntity(fieldName: string): boolean {
    const config = this.meta.columnConfigs[fieldName];
    return (!!config.editor && !!config.editor.relatedEntity);
  }


  // Relative navigation

  selectNext() {
    console.debug('Select the next entity');
    const entities: T[] = this.dataSource.entitiesSubject.getValue();
    const currentEntity: T | null = this.selectedEntity.getValue();
    if (!!currentEntity) {
      const isCurrentEntity = (entity: T) => entity.id === currentEntity.id;
      const currentIdx = entities.findIndex(isCurrentEntity);
      if (currentIdx > -1 && currentIdx < entities.length - 1) {
        this.selectedEntity.next(entities[currentIdx + 1]);
      }
    }
  }

  selectPrevious() {
    console.debug('Select the previous entity');
    const entities: T[] = this.dataSource.entitiesSubject.getValue();
    const currentEntity: T | null = this.selectedEntity.getValue();
    if (!!currentEntity) {
      const isCurrentEntity = (entity: T) => entity.id === currentEntity.id;
      const currentIdx = entities.findIndex(isCurrentEntity);
      if (currentIdx > 0) {
        this.selectedEntity.next(entities[currentIdx - 1]);
      }
    }
  }

  private unmarkSelectedRow() {
    const currentlySelectedRow: Element | null = this.el.nativeElement.querySelector('.' + this.selectedClass);
    if (!!currentlySelectedRow) {
      currentlySelectedRow.classList.remove(this.selectedClass);
    }
  }

  private markSelectedRow() {
    this.unmarkSelectedRow();

    const rows: NodeList = this.el.nativeElement.querySelectorAll('mat-row');
    const entities: T[] = this.dataSource.entitiesSubject.getValue();
    console.debug(`Test: ${rows.length} === ${entities.length}?: ${rows.length === entities.length}`);

    const currentEntity: T | null = this.selectedEntity.getValue();
    if (!!currentEntity) {
      const isCurrentEntity = (entity: T) => entity.id === currentEntity.id;
      const currentIdx = entities.findIndex(isCurrentEntity);
      if (currentIdx === -1) {
        console.debug('Entity was not found on the page currently showling');
      }
      if (currentIdx > -1 && currentIdx < rows.length) {
        (rows.item(currentIdx)! as Element).classList.add(this.selectedClass);

        // In case we are editing, continue editing
        if (this.isEditing()) {
          this.startEditing(entities[currentIdx], (rows.item(currentIdx) as Element), currentIdx);
        }
      }
    }
  }


  //
  getCellDisplayValue(entity: T, fieldName: string): string {
    const columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    let value = entity[fieldName];
    if (fieldName.indexOf('.')) {
      const fieldNameParts: string[] = fieldName.split('.');
      const key: string | undefined = fieldNameParts.shift();
      if (!!key) {
        value = entity[key];
        for (const fieldNamePart of fieldNameParts) {
          value = value[fieldNamePart];
        }
      }
    }
    if (columnConfig.renderer) {
      return columnConfig.renderer(entity, value);
    }
    return value;
  }

  getType(fieldName: string): string {
    const columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    return (!!columnConfig && columnConfig.editor && columnConfig.editor.type) ? columnConfig.editor.type : 'text';
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

  private static getCellClicked(event: MouseEvent): Element {
    let targetElement: Element = ((event.target || event.currentTarget) as Element);
    return ((targetElement.tagName.toLowerCase() === 'mat-cell') ? targetElement : targetElement.parentElement) as Element;
  }

  private static getRowClicked(event: MouseEvent): Element {
    return EntityListComponent.getCellClicked(event).parentElement as Element;
  }

  private applyOverlay(filters: FieldFilter[]): FieldFilter[] {
    const newFieldFilters: FieldFilter[] = [];
    for (const idx in Reflect.ownKeys(this.overlay)) {
      const key = (Reflect.ownKeys(this.overlay)[idx] as string);
      console.debug('-> applyOverlay', key, this.overlay[key]);
      if (this.overlay[key]['id']) {
        newFieldFilters.push({name: key + '.id', rawValue: this.overlay[key]['id']});
      } else {
        newFieldFilters.push({name: key, rawValue: this.overlay[key]});
      }
    }
    for (const idx in filters) {
      const fieldFilter: FieldFilter = filters[idx];
      if (!Reflect.ownKeys(this.overlay).includes(fieldFilter.name)) {
        newFieldFilters.push(fieldFilter);
      }
    }
    return newFieldFilters;
  }


  // From here: Editable mode only

  public newEntity() {
    if (this.isManaged) {
      this.selectEntity(null);
    } else {
      this.goToEmptyEditor();
    }
  }

  saveEntity(): void {
    console.debug(`Save this ${this.meta.displayName.toLowerCase()}`);

    this.editorActions.saveEntity(this.editorRow.rowEditorForm, this.overlay)
      .pipe(takeUntil(this.terminator)).subscribe((result: ActionResult<T>) => {
      if (result.success) {
        this.stopEditing().pipe(take(1)).subscribe(result => {
          console.info(`After save ${result.msg}`);
        });
        this.dataChanged.next();
        if (result.entity) {
          console.debug('Save result', result);
          this.selectedEntity.next(result.entity);
        }
      }
    });
  }

  isSaveable() {
    if (!!this.editorRow && !!this.editorRow.rowEditorForm) {
      return (this.isEditing() && this.editorRow.rowEditorForm.dirty && !this.editorRow.rowEditorForm.invalid);
    } else {
      return false;
    }
  }

  checkAndSave(): void {
    if (this.editorRow.rowEditorForm.dirty) {
      this.saveEntity();
    } else {
      this.justStopEditing();
    }
  }


  duplicateEntity(entity: T) {
    this.toggleEditor(true);
    let idField: any = this.editorRow.rowEditorForm.get('id');
    this.editorRow.loadEntity(entity);
    idField.setValue(undefined);
  }


  deleteEntity(entity: T): void {
    console.debug('Delete ' + this.meta.displayName);
    if (this.editorActions) {
      this.editorActions.deleteEntity(entity)
        .pipe(take(1)).subscribe((result: ActionResult<T>) => {
        if (result.success) {
          console.debug('Entity deleted');
          this.selectedEntity.next(null);
          this.dataChanged.next();
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

  toggleEditor(show?: boolean): void {
    if (this.isEditing()) {
      this.stopEditing().pipe(take(1)).subscribe((result: ActionResult<T>) => {
        this.editorVisible = (show != undefined) ? show : true;
      });
    } else {
      this.editorVisible = (show != undefined) ? show : !this.editorVisible;
    }
  }

  public startEditing(entity: T, rowElement: Element, idx: number) {
    console.debug('Are we currently editing? ' + this.isEditing());
    if (this.isEditing()) {
      this.stopEditing().pipe(take(1)).subscribe((result: ActionResult<T>) => {
        if (result.success) {
          console.debug('Start editing...');
          this.showAndPositionEditor(rowElement, idx);
          this.editorRow.loadEntity(entity);
          if (result.changes) {
            this.dataChanged.next();
          }
        } else {
          console.debug('Failed to stop editing...', result.msg);
        }
      });
    } else {
      console.debug('Not editing yet, start at row ' + idx);
      this.showAndPositionEditor(rowElement, idx);
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

  justStopEditing() {
    this.stopEditing().pipe(take(1)).subscribe();
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

  onKeyArrowDown(event: MouseEvent) {
    event.preventDefault();
    this.selectNext();
  }

  onKeyArrowUp(event: MouseEvent) {
    event.preventDefault();
    this.selectPrevious();
  }


  onDblClick(event: MouseEvent, entity: T, idx: number) {
    console.debug('Double click on entity ', entity);
    event.preventDefault();
    const rowElement: Element = EntityListComponent.getRowClicked(event);
    this.startEditing(entity, rowElement, idx);
  }

  private showAndPositionEditor(rowElement: Element, idx: number) {
    this.editorVisible = true;
    this.editorViewState.rowElement = (rowElement as HTMLElement);
    console.debug('row width:', this.editorViewState.rowElement.offsetWidth);
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
