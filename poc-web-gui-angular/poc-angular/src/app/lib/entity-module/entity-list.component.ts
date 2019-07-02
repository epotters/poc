import {AfterViewInit, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

import {FilterSet} from "../../common/filter.model";

import {ConfirmationDialogComponent} from "./confirmation-dialog.component";
import {EntityService} from "./entity.service";
import {EntityDataSource} from "./entity-data-source";
import {EntityMeta} from "./domain/entity-meta.model";


@Injectable()
export abstract class EntityListComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  dataSource: EntityDataSource<T>;

  total: number = 0;

  defaultSortDirection: string = 'asc';
  defaultPageSize: number = 100;

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
    console.debug(route.snapshot);
    console.debug('List of ' + this.meta.displayNamePlural);
  }


  ngOnInit() {
    console.debug('Initializing the EntityListComponent for type ' + this.meta.displayNamePlural);

    this.dataSource = new EntityDataSource<T>(this.meta, this.service);

    let filters: FilterSet = {
      filters: []
    };

    this.dataSource.loadEntities(filters, this.meta.defaultSortField, this.meta.defaultSortDirection,
      1, this.meta.defaultPageSize);
  }


  ngAfterViewInit(): void {

    // server-side search
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
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadEntitiesPage())
      )
      .subscribe();
  }


  pageChangeEvent(event) {
    console.debug('Page changed to number ' + event.pageIndex);
    this.total = this.dataSource.getTotal();
    console.debug('Total ' + this.dataSource.getTotal());
  }
  
  
  loadEntitiesPage() {
    this.dataSource.loadEntities(
      {filters: []},
      '',
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
          console.info('User confirmed batch delete action, so ik will be executed');
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
    console.log(this.meta.displayName + ' clicked: ', entity);
    this.router.navigate([this.meta.namePlural + '/' + entity.id]);
  }

}
