import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {BehaviorSubject} from "rxjs";

import {EntityEditorComponent} from "../lib/entity-module";
import {Organization, Employment} from "../core/domain/";
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
    public dialog: MatDialog
  ) {
    super(organizationMeta, service, router, route, formBuilder, dialog);
  }


  // ngOnInit() {
  //   super.ngOnInit();
  //
  //   this.entitySubject.asObservable().subscribe(entity => {
  //       console.debug('Subscription to the entitySubject');
  //       console.debug(entity);
  //
  //       if (entity) {
  //         this.employeeService.listEmployeesByEmployer(entity.id)
  //           .subscribe(employees => {
  //             console.debug('Inside subscription to the employeeService');
  //             console.debug(employees);
  //             this.employeesSubject.next(employees);
  //             console.debug('Just called employeesSubject.next');
  //           });
  //       } else {
  //         console.debug('No entity yet');
  //       }
  //     }
  //   )
  // }


  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
      id: new FormControl(),
      name: new FormControl('', [
        Validators.required
      ])
    });
  }

}
