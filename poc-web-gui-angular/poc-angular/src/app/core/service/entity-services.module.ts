import {NgModule} from '@angular/core';
import {EmploymentService} from '../../entities/employments/employment.service';
import {OrganizationService} from '../../entities/organizations/organization.service';
import {PersonService} from '../../entities/people/person.service';


@NgModule({
  providers: [
    {provide: 'PersonService', useExisting: PersonService},
    {provide: 'OrganizationService', useExisting: OrganizationService},
    {provide: 'EmploymentService', useExisting: EmploymentService}
  ]
})
export class EntityServicesModule {
}
