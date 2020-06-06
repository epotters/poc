import {Injectable} from '@angular/core';
import {EntityService}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Employment} from '../core/domain';
import {PocApiService} from '../core/service';
import {employmentMeta} from './employment-meta';


@Injectable({
  providedIn: 'root'
})
export class EmploymentService extends EntityService<Employment> {

  constructor(
    public apiService: PocApiService,
  public logger: NGXLogger) {
    super(employmentMeta, apiService, logger);
  }


  listEmployeesByEmployer(employerId: number): Observable<Employment[]> {
    return this.apiService.get('/organizations/' + employerId + '/employees');
  }


  listEmployeesByPerson(personId: number): Observable<Employment[]> {
    return this.apiService.get('/people/' + personId + '/employers')
      .pipe(map((response: Response) => {
        return response['content'];
      }));
  }

}
