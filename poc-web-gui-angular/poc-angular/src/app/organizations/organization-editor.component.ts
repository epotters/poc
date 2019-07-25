import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog, MatSnackBar} from "@angular/material";

import {BehaviorSubject} from "rxjs";

import {EntityEditorComponent} from "../lib/entity-module";
import {Employment, Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";


@Component({
  selector: 'organization-editor-card',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['../lib/entity-module/entity-editor.component.css']
})
export class OrganizationEditorComponent extends EntityEditorComponent<Organization> {

  employeesSubject = new BehaviorSubject<Employment[]>([]);


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
