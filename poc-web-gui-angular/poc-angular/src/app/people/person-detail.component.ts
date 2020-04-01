import {Component} from '@angular/core';
import * as moment from 'moment';
import {Person} from '../core/domain/';
import {EntityDetailComponent} from '../lib/entity-lib/entity-detail.component';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html'
})
export class PersonDetailComponent extends EntityDetailComponent<Person> {

  moment: any = moment;

  constructor(
    public service: PersonService,
  ) {
    super(personMeta, service);
  }

}

