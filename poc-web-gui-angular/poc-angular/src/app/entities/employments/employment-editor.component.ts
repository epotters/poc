import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

import {EntityEditorComponent, FieldFilter}  from '@epotters/entities';
import {NGXLogger} from 'ngx-logger';
import {take, takeUntil} from 'rxjs/operators';
import {Employment} from '../../core/domain';
import {OrganizationService} from '../organizations/organization.service';
import {PersonService} from '../people/person.service';
import {employmentMeta} from './employment-meta';
import {EmploymentService} from './employment.service';


@Component({
  selector: 'organization-employee-card',
  templateUrl: './employment-editor.component.html',
})
export class EmploymentEditorComponent extends EntityEditorComponent<Employment> {

  // Experimental
  showRelations: boolean = false;
  personColumns: string[] = ['id'];
  personFilters: FieldFilter[] = [];
  organizationColumns: string[] = ['id'];
  organizationFilters: FieldFilter[] = [];

  constructor(
    public service: EmploymentService,
    public router: Router,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public organizationService: OrganizationService,
    public personService: PersonService,
    public snackbar: MatSnackBar,
    public logger: NGXLogger
  ) {
    super(employmentMeta, service, router, route, formBuilder, dialog, snackbar, logger);
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
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['employee.id']) {
        const personId = params['employee.id'];
        this.personService.get(personId)
          .pipe(take(1)).subscribe(person => {
          this.entityForm.patchValue({employee: person}, {emitEvent: false});
        });
      }
      if (params['employer.id']) {
        const employerId = params['employer.id'];
        this.organizationService.get(employerId)
          .pipe(take(1)).subscribe(organization => {
          this.entityForm.patchValue({employer: organization}, {emitEvent: false});
        });
      }
    });
  }


  private activateExperimentalRelatedEntityList(): void {
    this.entitySubject.asObservable().pipe(takeUntil(this.terminator)).subscribe(owner => {
        if (owner) {

          this.logger.debug('Loaded employment', owner);

          this.personColumns = ['id', 'startDate', 'endDate', 'employer'];
          this.organizationColumns = ['id', 'startDate', 'endDate', 'employee'];

          this.personFilters = [{name: 'employee.id', rawValue: '' + owner.employee.id}];
          this.organizationFilters = [{name: 'employer.id', rawValue: '' + owner.employer.id}];

          this.showRelations = true;

        } else {
          this.logger.debug('No owner entity yet');
        }
      }
    );
  }
}
