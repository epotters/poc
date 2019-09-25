import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";

import {Employment, Organization, Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {organizationMeta} from "../organizations/organization-meta";
import {employmentMeta} from "../employments/employment-meta";

import {EmploymentService} from "../employments/employment.service";
import {OrganizationService} from "../organizations/organization.service";

@Component({
  selector: 'person-employers-relation-card',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class PersonEmployersRelationComponent extends EntityRelationComponent<Employment, Person, Organization> {

  constructor(
    public service: EmploymentService,
    public relatedService: OrganizationService,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {

    super(employmentMeta, personMeta, organizationMeta, service, relatedService, formBuilder, router, route);

    this.relationDisplayName = 'Employers';
    this.ownerFieldName = 'employee';
    this.relatedFieldName = 'employer';
    this.relatedDisplayField = 'name';
    this.relatedNamePlural = 'employers';

    this.filterFieldName = 'name';
    this.sortFieldName = 'name';
    this.sortDirection = 'asc';

  }
}
