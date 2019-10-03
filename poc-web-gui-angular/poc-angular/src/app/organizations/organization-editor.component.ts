import {Component, ComponentFactoryResolver, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog, MatSnackBar} from "@angular/material";

import {BehaviorSubject} from "rxjs";

import {EntityEditorComponent} from "../lib/entity-module";
import {Employment, Organization, Person} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";
import {EntityRelationComponent} from "../lib/entity-module/entity-relation.component";
import {employmentMeta} from "../employments/employment-meta";
import {personMeta} from "../people/person-meta";
import {EmploymentListComponent} from "../employments/employments-list.component";


@Component({
  selector: 'organization-editor-card',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['../lib/entity-module/entity-editor.component.css']
})
export class OrganizationEditorComponent extends EntityEditorComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    super(organizationMeta, service, router, route, formBuilder, dialog, snackbar);
  }

  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
      id: new FormControl(),
      name: new FormControl('', [
        Validators.required
      ])
    });
  }
}


@Component({
  selector: 'organization-employees-relation',
  templateUrl: '../lib/entity-module/entity-relation.component.html'
})
export class OrganizationEmployeesRelationComponent extends EntityRelationComponent<Employment, Organization, Person> {

  @Input() readonly ownerSubject: BehaviorSubject<Organization>;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(employmentMeta, organizationMeta, personMeta, componentFactoryResolver);
    this.fieldName = 'employees';
    this.component = EmploymentListComponent;
  }
}
