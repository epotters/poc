import {EntityListComponent} from "../../lib/entity-module";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {employeeMeta as meta} from "./organization-employee-meta";
import {Employee} from "../../core/domain/employee.model";
import {OrganizationEmployeeService} from "./organization-employee.service";


@Component({
  selector: 'organization-employee-list-card',
  templateUrl: '../../lib/entity-module/entity-list.component.html',
  styleUrls: ['../../lib/entity-module/entity-list.component.css']
})
export class OrganizationEmployeeListComponent extends EntityListComponent<Employee> {

  constructor(
    public service: OrganizationEmployeeService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(meta, service, router, route, dialog);
  }
}
