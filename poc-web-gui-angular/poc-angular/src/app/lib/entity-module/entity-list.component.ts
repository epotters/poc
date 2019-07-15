import {AfterViewInit, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";

import {merge, of as observableOf} from "rxjs";
import {catchError, delay, map, startWith, switchMap} from "rxjs/operators";

import {FilterSet} from "./domain/filter.model";
import {ConfirmationDialogComponent} from "./dialog/confirmation-dialog.component";
import {TableFilterDirective} from "./table-filter/directives/table-filter.directive";

import {ColumnConfig, EntityMeta} from "./domain/entity-meta.model";
import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";


export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Output() entitySelector: EventEmitter<T> = new EventEmitter<T>();

  isVisible: boolean = true;
  useRouter: boolean = false;

  dataSource: EntityDataSource<T>;

  startPage: number = 0;

  filters: FilterSet = {
    filters: []
  };

  // Filter row
  public filterControls: Map<string, FormControl> = new Map<string, FormControl>([]);
  public filterValues: Partial<T> = {};

  @ViewChild(TableFilterDirective, {static: false}) tableFilter: TableFilterDirective;
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
    this.buildFilterControls();
    this.dataSource = new EntityDataSource<T>(this.meta, this.service);
    this.dataSource.loadEntities(this.filters, this.meta.defaultSortField, this.meta.defaultSortDirection,
      this.startPage, this.meta.defaultPageSize);
  }

  ngAfterViewInit(): void {

    console.log('tableFilter: ', this.tableFilter);

    // Reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    merge(this.sort.sortChange, this.paginator.page, this.tableFilter.filterChange)
      .pipe(
        startWith({}),
        delay(0), // Workarond for "Expression has changed" error
        switchMap(() => {
          // this.isLoadingResults = true;
          // return this.dataService.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex, );

          this.updateFilter();
          this.loadEntitiesPage();
          return this.dataSource.getEntities();
        }),
        map(data => {
          // this.isLoadingResults = false;
          // this.resultsLength = data.total_count;
          // return data.items;

          return this.dataSource.getEntities();
        }),
        catchError(() => {
          // this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        // this.dataSource.data = data;
      }
    );


    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     tap(() => {
    //       this.loadEntitiesPage();
    //       this.total = this.dataSource.getTotal();
    //     })
    //   )
    //   .subscribe();


    // TODO: Remove this
    // Server-side search
    // fromEvent(this.filterField.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.buildFilters(this.filterField.nativeElement.value);
    //       this.paginator.pageIndex = 0;
    //       this.loadEntitiesPage();
    //     })
    //   )
    //   .subscribe();

  }


  // ngOnChanges () { // ngOnChanges is a component LifeCycle Hook that should run the following code when there is a change to the components view (like when the child elements appear in the DOM for example)
  //   this.tableFilter.changes.subscribe( // subscribe to any changes to the ref which should change from undefined to an actual value once showMe is switched to true (which triggers *ngIf to show the component)
  //     (result) => {
  //       console.log(result.first['_results'][0].nativeElement);
  //       console.log(result.first.nativeElement);
  //
  //       // Do Stuff with referenced element here...
  //     }
  //   ); // end subscribe
  // } // end onChanges


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
    if (this.useRouter) {
      this.router.navigate([this.meta.namePlural + '/' + entity.id]);
    }
  }


  getCellDisplayValue(entity: T, fieldName: string): string {
    let columnConfig: ColumnConfig = this.meta.columnConfigs[fieldName];
    let value = entity[fieldName];
    if (columnConfig.renderer) {
      return columnConfig.renderer(value);
    }
    return value;
  }


  /* Filter */
  updateFilter() {
    console.debug('Process this.tableFilter.filterJson: ' + this.tableFilter.filterJson);
  }


  private buildFilters(term: string): void {
    this.filters.filters = [{name: this.meta.defaultFilterField, value: term}];
  }


  buildFilterControls() {
    for (let columnName of this.meta.displayedColumns) {
      let formControl = new FormControl('');
      this.filterControls[columnName] = formControl;
      formControl.valueChanges.subscribe(
        value => {
          this.filterValues[columnName] = value;
        }
      );
    }
  }


  newEntity() {
    this.selectEntity(null);
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
  


  public show(): void {
    this.isVisible = true;
  }

  public hide(): void {
    this.isVisible = false;
  }

}
