import {Identifiable} from '@epotters/entities/lib';
import {Moment} from 'moment';

declare type Gender = 'MALE' | 'FEMALE'

export class Person implements Identifiable {
  id: number;
  firstName: string;
  prefix: string;
  lastName: string;
  gender: Gender;
  birthDate: Moment;
  birthPlace: string;
  household: string;

  fullName(): string {
    return `${this.firstName} ${(this.prefix) ? this.prefix + ' ' : ''}${this.lastName}`;
  }
}
