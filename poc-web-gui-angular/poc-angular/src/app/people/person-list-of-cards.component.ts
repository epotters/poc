import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {PocAnimations} from '../app-animations';
import {Person} from '../core/domain/';
import {ComponentLoader} from '../lib/entity-lib/common/component-loader/component-loader';
import {EntityListOfCardsComponent} from '../lib/entity-lib/entity-list-of-cards.component';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


@Component({
  selector: 'person-list-of-cards',
  templateUrl: './person-list-of-cards.component.html',
  styleUrls: ['../lib/entity-lib/entity-list.component.css'],
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
    public dialog: MatDialog,
    public componentLoader: ComponentLoader<Person>
  ) {

    super(personMeta, service, router, route, dialog, componentLoader);
  }

}
