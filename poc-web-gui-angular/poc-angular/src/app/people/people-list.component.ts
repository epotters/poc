import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FilterSet} from "../common/filter.model";
import {PeopleDataSource} from "./people-data-source";
import {PeopleService} from "../core/service/people.service";

import {ConfirmationDialogComponent} from "./confirmation-dialog.component";


@Component({
  selector: 'people-list-card',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'firstName', 'prefix', 'lastName', 'gender', 'birthDate', 'birthPlace'];
  dataSource: PeopleDataSource;
  total: number = 1000; // TODO: get this from the api call response

  defaultSortField: string = 'lastName';
  defaultSortDirection: string = 'asc';
  defaultPageSize: number = 100;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('input', {static: true}) input: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(
    private peopleService: PeopleService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

    console.debug('Constructing the PeopleListComponent');

    console.debug(route.snapshot);
  }


  ngOnInit() {
    console.debug('Initializing the PeopleListComponent');

    this.dataSource = new PeopleDataSource(this.peopleService);

    let filters: FilterSet = {
      filters: []
    };

    this.dataSource.loadPeople(filters, this.defaultSortField, this.defaultSortDirection, 1, this.defaultPageSize);
  }


  private onRowClicked(person): void {
    console.log('Person clicked: ', person);
    this.router.navigate(['//people/' + person.id]);
  }


  ngAfterViewInit(): void {

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPeoplePage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPeoplePage())
      )
      .subscribe();
  }

  updatePeople() {
    const dialogRef = this.openConfirmationDialog('Confirm batch update',
      'Are you sure you want to update all selected people?');
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

  deletePeople() {
    const dialogRef = this.openConfirmationDialog('Confirm deletion',
      'Are you sure you want to delete all selected people?');
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


  loadPeoplePage() {
    this.dataSource.loadPeople(
      {filters: []},
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
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

}
