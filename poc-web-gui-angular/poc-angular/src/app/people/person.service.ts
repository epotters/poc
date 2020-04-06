import {Injectable} from '@angular/core';
import {EntityService} from 'entity-lib';
import {Person} from '../core/domain';
import {PocApiService} from '../core/service';
import {personMeta} from './person-meta';


@Injectable({
  providedIn: 'root'
})
export class PersonService extends EntityService<Person> {
  constructor(
    public apiService: PocApiService) {
    super(personMeta, apiService);
  }
}
