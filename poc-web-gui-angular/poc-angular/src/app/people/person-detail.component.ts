import {Component} from '@angular/core';
import {EntityDetailComponent}  from '@epotters/entities';
import * as moment from 'moment';
import {NGXLogger} from 'ngx-logger';
import {Person} from '../core/domain/';
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
    public logger: NGXLogger
  ) {
    super(personMeta, service, logger);
  }

}

