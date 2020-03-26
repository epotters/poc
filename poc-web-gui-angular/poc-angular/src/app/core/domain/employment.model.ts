import {Moment} from 'moment';
import {Identifiable} from '../../lib/entity-module';
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
