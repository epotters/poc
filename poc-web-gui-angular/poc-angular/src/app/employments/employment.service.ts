import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {EntityService} from "../lib/entity-module";
import {PocApiService} from "../core/service";
import {Employment} from "../core/domain";
import {employmentMeta} from "./employment-meta";


@Injectable({
  providedIn: 'root'
})
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
