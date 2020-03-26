import {Injectable} from '@angular/core';
import {EntityService} from '../lib/entity-module';
import {PocApiService} from '../core/service';
import {Person} from '../core/domain';
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
