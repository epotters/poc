import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {ComponentLoader, EntityListOfCardsComponent}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';

import {PocAnimations} from '../app-animations';
import {Person} from '../core/domain/';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


@Component({
  selector: 'person-list-of-cards',
  templateUrl: './person-list-of-cards.component.html',
  animations: [
    PocAnimations.slideInOut
  ]
})
export class PersonListOfCardsComponent extends EntityListOfCardsComponent<Person> {


  moment: any = moment;
  pageSize = 30;

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public componentLoader: ComponentLoader<Person>,
    public logger: NGXLogger
  ) {

    super(personMeta, service, router, route, dialog, componentLoader, logger);
  }

}
