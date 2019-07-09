import {EntityListComponent} from "../lib/entity-module";
import {Person} from "../core/domain/";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {PersonService} from "./person.service";
import {personMeta} from "./person-meta";

@Component({
  selector: 'person-list-card',
  templateUrl: './person-list.component.html'
})
export class PersonListComponent extends EntityListComponent<Person> {

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(personMeta, service, router, route, dialog);
  }

}
