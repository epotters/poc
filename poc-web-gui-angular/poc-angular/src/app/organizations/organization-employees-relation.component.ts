import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";

import {Employment, Organization, Person} from "../core/domain/";
import {personMeta} from "../people/person-meta";
import {organizationMeta} from "./organization-meta";
import {employmentMeta} from "../employments/employment-meta";

import {EmploymentService} from "../employments/employment.service";
import {FormBuilder} from "@angular/forms";
import {PersonService} from "../people/person.service";

@Component({
  selector: 'organization-employees-relation-card',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class OrganizationEmployeesRelationComponent extends EntityRelationComponent<Employment, Organization, Person> {

  constructor(
    public service: EmploymentService,
    public relatedService: PersonService,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(employmentMeta, organizationMeta, personMeta, service, relatedService, formBuilder,router, route);

    this.relationDisplayName = 'Employees';
    this.ownerFieldName = 'employer';
    this.relatedFieldName = 'employee';
    this.relatedDisplayField = 'lastName';
    this.relatedNamePlural = 'employees';

    this.filterFieldName = 'lastName';
    this.sortFieldName = 'lastName';
    this.sortDirection = 'asc';

  }

}
