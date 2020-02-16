import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {EntityEditorComponent} from "../lib/entity-module";
import {EmploymentService} from "./employment.service";
import {PersonService} from "../people/person.service";
import {OrganizationService} from "../organizations/organization.service";
import {Employment} from "../core/domain";
import {employmentMeta} from "./employment-meta";
import {FieldFilter} from "../lib/entity-module/domain/filter.model";


@Component({
  selector: 'organization-employee-card',
  templateUrl: './employment-editor.component.html',
  styleUrls: ['../lib/entity-module/entity-editor.component.css']
})
export class EmploymentEditorComponent extends EntityEditorComponent<Employment> {


  constructor(
    public service: EmploymentService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public organizationService: OrganizationService,
    public personService: PersonService,
    public snackbar: MatSnackBar
  ) {
    super(employmentMeta, service, router, route, formBuilder, dialog, snackbar);
  }


  ngOnInit() {
    super.ngOnInit();
    // if (this.isNew()) {
    //   this.prefillFromParameters();
    // }
    // this.activateExperimentalRelatedEntityList();
  }


  buildForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      id: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      employer: new FormControl('', [
        Validators.required
      ]),
      employee: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl()
    });
  }


  prefillFromParameters(): void {
    this.route.queryParams.subscribe(params => {
      if (params['employee.id']) {
        const personId = params['employee.id'];
        this.personService.get(personId)
          .subscribe(person => {
            this.entityForm.patchValue({employee: person}, {emitEvent: false});
          });
      }
      if (params['employer.id']) {
        const employerId = params['employer.id'];
        this.organizationService.get(employerId)
          .subscribe(organization => {
            this.entityForm.patchValue({employer: organization}, {emitEvent: false});
          })
      }
    });
  }


  // Experimental
  showRelations: boolean = false;
  personColumns: string[] = ['id'];
  personFilters: FieldFilter[] = [];
  organizationColumns: string[] = ['id'];
  organizationFilters: FieldFilter[] = [];


  private activateExperimentalRelatedEntityList(): void {
    this.entitySubject.asObservable().subscribe(owner => {
        if (owner) {

          console.debug('---> Loaded employment', owner);

          this.personColumns = ['id', 'startDate', 'endDate', 'employer'];
          this.organizationColumns = ['id', 'startDate', 'endDate', 'employee'];

          this.personFilters = [{name: 'employee.id', rawValue: '' + owner.employee.id}];
          this.organizationFilters = [{name: 'employer.id', rawValue: '' + owner.employer.id}];

          this.showRelations = true;

        } else {
          console.debug('No owner entity yet');
        }
      }
    );
  }
}
