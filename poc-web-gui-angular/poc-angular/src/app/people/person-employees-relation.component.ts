import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Organization, Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";
import {Employee} from "../core/domain/employee.model";
import {organizationMeta} from "../organizations/organization-meta";
import {employeeMeta} from "../organizations/employees/organization-employee-meta";
import {OrganizationEmployeeService} from "../organizations/employees/organization-employee.service";

@Component({
  selector: 'person-employees-relation-card',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class PersonEmployeesRelationComponent extends EntityRelationComponent<Employee, Person, Organization> {


  constructor(
    public service: OrganizationEmployeeService,
    public route: ActivatedRoute,
  ) {
    super(employeeMeta, personMeta, organizationMeta, service, route);

    this.ownerFieldName = 'person';
    this.relatedFieldName = 'employer';
    this.relatedDisplayField = 'name';
    this.relationDisplayName = 'Employers';
    
  }

}
