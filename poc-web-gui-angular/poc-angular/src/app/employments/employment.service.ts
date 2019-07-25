import {EntityService} from "../lib/entity-module";
import {PocApiService} from "../core/service";
import {Employment} from "../core/domain/employment.model";
import {employmentMeta} from "./employment-meta";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

export class EmploymentService extends EntityService<Employment> {

  constructor(
    public apiService: PocApiService) {
    super(employmentMeta, apiService);
  }


  listEmployeesByEmployer(employerId: number): Observable<Employment[]> {
    return this.apiService.get('/organizations/' + employerId + '/employees');
  }


  listEmployeesByPerson(personId: number): Observable<Employment[]> {
    return this.apiService.get('/people/' + personId + '/employers')
      .pipe(map((response: Response) => {
        console.debug(response);
        return response["content"];
      }));
  }
}
