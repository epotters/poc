import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {EntityEditorComponent} from "../lib/entity-module";
import {Person} from "../core/domain/";
import {personMeta} from "./person-meta";
import {PersonService} from "./person.service";

@Component({
  selector: 'person-card',
  templateUrl: './person-editor.component.html'
})
export class PersonEditorComponent extends EntityEditorComponent<Person> {

  personNamePattern: string = '[a-zA-Z -]*';

  constructor(
    public service: PersonService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super(personMeta, service, router, route, formBuilder, dialog);
  }


  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
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
