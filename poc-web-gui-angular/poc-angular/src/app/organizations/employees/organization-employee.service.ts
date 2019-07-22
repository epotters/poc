import {EntityService} from "../../lib/entity-module";
import {PocApiService} from "../../core/service";
import {Employee} from "../../core/domain/employee.model";
import {employeeMeta} from "./organization-employee-meta";

export class OrganizationEmployeeService extends EntityService<Employee> {

  constructor(
    public apiService: PocApiService) {
    super(employeeMeta, apiService);
  }
}
