import {Person} from "../core/domain/";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {EntityListOfCardsComponent} from "../lib/entity-module/entity-list-of-cards.component";
import {PersonService} from "./person.service";
import {personMeta} from "./person-meta";
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'person-list-of-cards',
  templateUrl: './person-list-of-cards.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css']
})
export class PersonListOfCardsComponent extends EntityListOfCardsComponent<Person> {

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(personMeta, service, router, route, dialog);
  }
  

}
