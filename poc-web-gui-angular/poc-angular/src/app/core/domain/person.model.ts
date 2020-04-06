import {Identifiable} from 'entity-lib/lib';
import {Moment} from 'moment';


export class Person implements Identifiable {
  id: number;
  firstName: string;
  prefix: string;
  lastName: string;
  gender: string;
  birthDate: Moment;
  birthPlace: string;
  household: string;

  fullName(): string {
    return `${this.firstName} ${(this.prefix) ? this.prefix + ' ' : ''}${this.lastName}`;
  }
}
