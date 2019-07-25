import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";

import {Organization, Person, Employment} from "../core/domain/";
import {personMeta} from "./person-meta";
import {organizationMeta} from "../organizations/organization-meta";
import {employmentMeta} from "../employments/employment-meta";

import {EmploymentService} from "../employments/employment.service";

@Component({
  selector: 'person-employers-relation-card',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class PersonEmployersRelationComponent extends EntityRelationComponent<Employment, Person, Organization> {

  constructor(
    public service: EmploymentService,
    public route: ActivatedRoute,
  ) {
    super(employmentMeta, personMeta, organizationMeta, service, route);

    this.relationDisplayName = 'Employers';
    this.ownerFieldName = 'employee';
    this.relatedFieldName = 'employer';
    this.relatedDisplayField = 'name';
    this.relatedNamePlural = 'employers';


  }

}
