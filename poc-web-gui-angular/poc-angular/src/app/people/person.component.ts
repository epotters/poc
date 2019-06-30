import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";

import {Person} from "../core/domain";
import {PeopleService} from "../core/service";

@Component({
  selector: 'person-card',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  personForm: FormGroup;
  personNamePattern: string = '[a-zA-Z -]*';

  personValidationMessages = {
    'firstName': [
      {type: 'required', message: 'First name is required'},
      {type: 'pattern', message: 'First name can only contain characters, dashes and spaces'}
    ],
    'lastName': [
      {type: 'required', message: 'Last name is required'},
      {type: 'pattern', message: 'Last name can only contain characters, dashes and spaces'},
      {type: 'maxlength', message: 'Last name must not be longer than 60 characters'}
    ]
  };

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {

    console.debug('Constructing the PersonComponent');

    this.buildForm(formBuilder);
    console.debug('Person editor is ready');
  }

  ngOnInit() {
    console.debug('Initializing the PersonComponent');
    const personId = this.route.snapshot.paramMap.get('id');
    if (personId) {
      this.loadPerson(personId);
    } else {
      console.info('Editor for a new person');
    }
  }

  loadPerson(personId) {
    this.peopleService.get(personId).pipe(
      tap(person => {
        console.log('About to patch the person loaded');
        console.debug(person);
        this.personForm.patchValue(person);
        console.log('Person loaded');
      })
    ).subscribe();
  }

  savePerson() {
    if (this.personForm.valid) {
      let person: Person = this.personForm.getRawValue();
      console.debug("Ready to save person: " + JSON.stringify(person));
      this.peopleService.save(person).subscribe((response) => {
        console.log('repsonse ', response);
      });
    } else {
      console.info('Not a valid person');
    }
  }

  deletePerson() {
    if (this.isNew()) {
      return;
    }
    const dialogRef = this.openConfirmationDialog('Confirm delete',
      'Are you sure you want to delete this person?');
    dialogRef.afterClosed().subscribe(
      data => {
        console.debug("Dialog output:", data);
        if (data.confirmed) {
          console.info('User confirmed delete action, so ik will be executed');
        } else {
          console.info('User canceled delete action');
        }
      }
    );
  }

  revert() {
    let personId = this.personForm.getRawValue().id;
    if (personId) {
      this.loadPerson(personId);
    } else {
      // TODO: Clear the form
    }
  }

  isNew(): boolean {
    let person: Person = this.personForm.getRawValue();
    return (!person || !person.id);
  }

  hasValidChanges() {
    return this.personForm.dirty && this.personForm.valid;
  }

  hasErrorOfType(fieldName: string, validationType: string): boolean {
    const formControl = this.personForm.get(fieldName);
    return (formControl.hasError(validationType) && (formControl.dirty || formControl.touched));
  }

  onValueChanged(fieldName: string, newValue: string) {
    console.debug('Field ' + fieldName + ' changed to ' + newValue);
    this.personForm.patchValue({[fieldName]: newValue});
  }

  buildForm(formBuilder: FormBuilder) {
    this.personForm = formBuilder.group({
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

  openConfirmationDialog(title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: title,
      message: message
    };
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig);
  }


}
