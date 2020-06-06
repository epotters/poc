import {Component, ComponentFactoryResolver, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityEditorComponent, EntityRelationComponent}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';

import {BehaviorSubject} from 'rxjs';

import {Employment, Organization, Person} from '../core/domain/';
import {employmentMeta} from '../employments/employment-meta';
import {EmploymentListComponent} from '../employments/employments-list.component';
import {personMeta} from '../people/person-meta';
import {organizationMeta} from './organization-meta';
import {OrganizationService} from './organization.service';


@Component({
  selector: 'organization-editor-card',
  templateUrl: './organization-editor.component.html'
})
export class OrganizationEditorComponent extends EntityEditorComponent<Organization> {

  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public logger: NGXLogger
  ) {
    super(organizationMeta, service, router, route, formBuilder, dialog, snackbar, logger);
  }

  buildForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: new FormControl(),
      name: new FormControl('', [
        Validators.required
      ])
    });
  }
}


@Component({
  selector: 'organization-employees-relation',
  templateUrl: '../lib/entity-relation.component.html'
})
export class OrganizationEmployeesRelationComponent extends EntityRelationComponent<Employment, Organization, Person> {

  @Input() readonly ownerSubject: BehaviorSubject<Organization>;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public logger: NGXLogger
  ) {
    super(employmentMeta, organizationMeta, personMeta, componentFactoryResolver, logger);
    this.fieldName = 'employees';
    this.component = EmploymentListComponent;
  }
}
