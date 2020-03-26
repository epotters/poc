import {Person} from '../core/domain/';
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {EntityListOfCardsComponent} from '../lib/entity-module/entity-list-of-cards.component';
import {PersonService} from './person.service';
import {personMeta} from './person-meta';
import {PocAnimations} from '../app-animations';


@Component({
  selector: 'person-list-of-cards',
  templateUrl: './person-list-of-cards.component.html',
  styleUrls: ['../lib/entity-module/entity-list.component.css'],
  animations: [
    PocAnimations.slideInOut
  ]
})
export class PersonListOfCardsComponent extends EntityListOfCardsComponent<Person> {

  pageSize = 1;

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {

    super(personMeta, service, router, route, dialog);
  }


}
