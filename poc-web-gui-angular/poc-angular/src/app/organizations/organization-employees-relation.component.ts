import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";

import {Employment, Organization, Person} from "../core/domain/";
import {personMeta} from "../people/person-meta";
import {organizationMeta} from "./organization-meta";
import {employmentMeta} from "../employments/employment-meta";

import {EmploymentService} from "../employments/employment.service";

@Component({
  selector: 'organization-employees-relation-card',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class OrganizationEmployeesRelationComponent extends EntityRelationComponent<Employment, Organization, Person> {

  constructor(
    public service: EmploymentService,
    public route: ActivatedRoute,
  ) {
    super(employmentMeta, organizationMeta, personMeta, service, route);

    this.relationDisplayName = 'Employees';
    this.ownerFieldName = 'employer';
    this.relatedFieldName = 'employee';
    this.relatedDisplayField = 'lastName';
    this.relatedNamePlural = 'employees';

  }

}
