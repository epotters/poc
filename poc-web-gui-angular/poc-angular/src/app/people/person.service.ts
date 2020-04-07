import {Injectable} from '@angular/core';
import {EntityService} from 'entity-lib';
import {NGXLogger} from 'ngx-logger';
import {Person} from '../core/domain';
import {PocApiService} from '../core/service';
import {personMeta} from './person-meta';


@Injectable({
  providedIn: 'root'
})
export class PersonService extends EntityService<Person> {
  constructor(
    public apiService: PocApiService,
    public logger: NGXLogger) {
    super(personMeta, apiService, logger);
  }
}
