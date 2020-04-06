import {Component, ComponentFactoryResolver, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

import {EntityEditorComponent, EntityRelationComponent, SelectOption} from 'entity-lib';
import {BehaviorSubject} from 'rxjs';

import {Employment, Organization, Person} from '../core/domain/';
import {employmentMeta} from '../employments/employment-meta';
import {EmploymentListComponent} from '../employments/employments-list.component';
import {organizationMeta} from '../organizations/organization-meta';
import {personMeta} from './person-meta';
import {PersonService} from './person.service';


@Component({
  selector: 'person-editor-card',
  templateUrl: './person-editor.component.html'
})
export class PersonEditorComponent extends EntityEditorComponent<Person> {

  personNamePattern: string = '[a-zA-Z -]*';
  genderOptions: SelectOption[];

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    super(personMeta, service, router, route, formBuilder, dialog, snackbar);

    this.genderOptions = ((!!personMeta.columnConfigs['gender'].editor && !!personMeta.columnConfigs['gender'].editor.options) ?
      personMeta.columnConfigs['gender'].editor.options : []);
  }

  buildForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: new FormControl(),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.personNamePattern)
      ]),
      prefix: new FormControl(),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.personNamePattern),
        Validators.maxLength(60)]),
      gender: new FormControl(),
      birthDate: new FormControl(),
      birthPlace: new FormControl()
    });
  }
}


@Component({
  selector: 'person-employers-relation',
  templateUrl: '../lib/entity-relation.component.html'
})
export class PersonEmployersRelationComponent extends EntityRelationComponent<Employment, Person, Organization> {

  @Input() readonly ownerSubject: BehaviorSubject<Person>;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(employmentMeta, personMeta, organizationMeta, componentFactoryResolver);
    this.fieldName = 'employers';
    this.component = EmploymentListComponent;
  }
}

