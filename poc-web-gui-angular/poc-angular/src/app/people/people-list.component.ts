import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";


import {FilterSet} from "../common/filter.model";

import {PeopleService} from "../core/service/people.service";
import {PeopleDataSource} from "./PeopleDataSource";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort} from "@angular/material";
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;


  constructor(private peopleService: PeopleService, private router: Router,
              private route: ActivatedRoute, private dialog: MatDialog) {

    console.debug('Constructing the PeopleListComponent');
  }


  ngOnInit() {
    console.debug('Initializing the PeopleListComponent');

    this.dataSource = new PeopleDataSource(this.peopleService);

    let filters: FilterSet = {
      filters: [{name: 'lastName', value: 'Potters'}]
    };

    this.dataSource.loadPeople(filters, 'lastName', 'asc', 1, 100);
  }


  onRowClicked(person) {
    console.log('Person clicked: ', person);
    this.router.navigate(['//people/' + person.id]);
  }


  ngAfterViewInit() {

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
