import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {EntityEditorComponent} from "../lib/entity-module";
import {Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";

@Component({
  selector: 'organization-card',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['../lib/entity-module/entity-editor.component.css']
})
export class OrganizationEditorComponent extends EntityEditorComponent<Organization> {
  constructor(
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super(organizationMeta, service, router, route, formBuilder, dialog);
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
