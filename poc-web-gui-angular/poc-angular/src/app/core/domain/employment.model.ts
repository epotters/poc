import {Identifiable} from 'entity-lib/lib';
import {Moment} from 'moment';

import {Organization} from './organization.model';
import {Person} from './person.model';


export class Employment implements Identifiable {
  id: number;
  startDate: Moment;
  endDate: Moment;
  employee: Person;
  employer: Organization;
  description: string;
}
