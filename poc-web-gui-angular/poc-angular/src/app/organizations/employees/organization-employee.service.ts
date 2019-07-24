import {EntityResult, EntityService} from "../../lib/entity-module";
import {PocApiService} from "../../core/service";
import {Employee} from "../../core/domain/employee.model";
import {employeeMeta} from "./organization-employee-meta";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

export class OrganizationEmployeeService extends EntityService<Employee> {

  constructor(
    public apiService: PocApiService) {
    super(employeeMeta, apiService);
  }


  listEmployeesByEmployer(employerId: number): Observable<Employee[]> {
    return this.apiService.get('/organizations/' + employerId + '/employees');
  }


  listEmployeesByPerson(personId: number): Observable<Employee[]> {
    return this.apiService.get('/people/' + personId + '/employers')
      .pipe(map((response: Response) => {
        console.debug(response);
        return response["content"];
      }));
  }
}
