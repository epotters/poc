import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog, MatSnackBar} from "@angular/material";

import {EntityDataSource, EntityEditorComponent} from "../lib/entity-module";
import {EmploymentService} from "./employment.service";
import {PersonService} from "../people/person.service";
import {OrganizationService} from "../organizations/organization.service";
import {Employment, Organization, Person} from "../core/domain";
import {employmentMeta} from "./employment-meta";
import {organizationMeta} from "../organizations/organization-meta";
import {personMeta} from "../people/person-meta";


@Component({
  selector: 'organization-employee-card',
  templateUrl: './employment-editor.component.html',
  styleUrls: ['../lib/entity-module/entity-editor.component.css']
})
export class EmploymentEditorComponent extends EntityEditorComponent<Employment> {

  organizationsDataSource: EntityDataSource<Organization>;
  peopleDataSource: EntityDataSource<Person>;

  autoCompletePageSize: number = 25;

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

    this.organizationsDataSource = new EntityDataSource<Organization>(organizationMeta, this.organizationService);
    this.peopleDataSource = new EntityDataSource<Person>(personMeta, this.personService);
  }


  ngOnInit() {
    super.ngOnInit();

    if (this.isNew()) {
      this.prefillFromParameters();
    }

    this.activateEmployerControl();

    this.activateEmployeeControl();
  }


  buildForm(formBuilder: FormBuilder) {
    this.entityForm = formBuilder.group({
      id: new FormControl(),
      employer: new FormControl('', [
        Validators.required
      ]),
      employee: new FormControl('', [
        Validators.required
      ])
    });
  }


  private activateEmployeeControl(): void {
    this.entityForm
      .get('employee')
      .valueChanges
      .subscribe((value) => {
        console.debug('About to load new people for autocomplete. Filter ' + value);
        this.peopleDataSource.loadEntities(
          [{name: 'lastName', rawValue: value}],
          'lastName',
          'asc',
          0,
          this.autoCompletePageSize
        );
      });
  }


  private activateEmployerControl(): void {
    this.entityForm
      .get('employer')
      .valueChanges
      .subscribe((value) => {

        console.debug('About to load new organizations for autocomplete. Filter ' + value);

        this.organizationsDataSource.loadEntities(
          [{name: 'name', rawValue: value}],
          'name',
          'asc',
          0,
          this.autoCompletePageSize
        );
      });
  }


  prefillFromParameters(): void {

    this.route.queryParams.subscribe(params => {

      if (params['employee.id']) {
        const personId = params['employee.id'];
        this.personService.get(personId)
          .subscribe(person => {
            this.entityForm.patchValue({employee: person});
          });
      }

      if (params['employer.id']) {
        const employerId = params['employer.id'];
        this.organizationService.get(employerId)
          .subscribe(organization => {
            this.entityForm.patchValue({employer: organization});
          })
      }
    });
  }


  displayOptionOrganization(organization?: Organization): string | undefined {
    return organization.name;
  }


  displayOptionPerson(person?: Person): string | undefined {
    if (person) {
      return (person.firstName + ' ' + ((person.prefix) ? person.prefix + ' ' : '') + person.lastName);
    } else {
      return undefined;
    }
  }

}
