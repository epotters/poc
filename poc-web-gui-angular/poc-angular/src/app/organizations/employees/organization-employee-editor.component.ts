import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";

import {EntityDataSource, EntityEditorComponent} from "../../lib/entity-module";
import {OrganizationEmployeeService} from "./organization-employee.service";
import {Employee} from "../../core/domain/employee.model";
import {employeeMeta} from "./organization-employee-meta";
import {Organization, Person} from "../../core/domain";
import {organizationMeta} from "../organization-meta";
import {personMeta} from "../../people/person-meta";
import {PersonService} from "../../people/person.service";
import {OrganizationService} from "../organization.service";

@Component({
  selector: 'organization-employee-card',
  templateUrl: './organization-employee-editor.component.html',
  styleUrls: ['../../lib/entity-module/entity-editor.component.css']
})
export class OrganizationEmployeeEditorComponent extends EntityEditorComponent<Employee> {

  organizationsDataSource: EntityDataSource<Organization>;
  peopleDataSource: EntityDataSource<Person>;

  autoCompletePageSize: number = 25;

  constructor(
    public service: OrganizationEmployeeService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public organizationService: OrganizationService,
    public personService: PersonService,
  ) {
    super(employeeMeta, service, router, route, formBuilder, dialog);

    this.organizationsDataSource = new EntityDataSource<Organization>(organizationMeta, this.organizationService);
    this.peopleDataSource = new EntityDataSource<Person>(personMeta, this.personService);
  }


  ngOnInit() {
    super.ngOnInit();

    if (this.isNew()) {
      this.prefillFromParameters();
    }

    this.activatePersonControl();

    this.activateEmployerControl();
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


  activatePersonControl(): void {
    this.entityForm
      .get('person')
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


  activateEmployerControl(): void {
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

      if (params['person.id']) {
        const personId = params['person.id'];
        this.personService.get(personId)
          .subscribe(person => {
            this.entityForm.patchValue({person: person});
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
