
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {EntityComponent} from "../lib/entity-module";
import {Organization} from "../core/domain/";
import {OrganizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";

@Component({
  selector: 'organization-card',
  templateUrl: './organization.component.html',
  styleUrls: ['../lib/entity-module/entity.component.css']
})
export class OrganizationComponent extends EntityComponent<Organization> {
  constructor(
    public meta: OrganizationMeta,
    public service: OrganizationService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, formBuilder, dialog);
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
