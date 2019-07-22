import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {EntityComponent} from "../../lib/entity-module";
import {OrganizationEmployeeService} from "./organization-employee.service";
import {Employee} from "../../core/domain/employee.model";
import {employeeMeta} from "./organization-employee-meta";

@Component({
  selector: 'organization-employee-card',
  templateUrl: './organization-employee.component.html',
  styleUrls: ['../../lib/entity-module/entity.component.css']
})
export class OrganizationEmployeeComponent extends EntityComponent<Employee> {
  constructor(
    public service: OrganizationEmployeeService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super(employeeMeta, service, router, route, formBuilder, dialog);
  }


  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
      id: new FormControl(),
      person: new FormControl('', [
        Validators.required
      ]),
      employer: new FormControl('', [
        Validators.required
      ])
    });
  }

}
