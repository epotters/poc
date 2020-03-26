import {NgModule} from '@angular/core';
import {PersonService} from '../../people/person.service';
import {OrganizationService} from '../../organizations/organization.service';
import {EmploymentService} from '../../employments/employment.service';


@NgModule({
  providers: [
    {provide: 'PersonService', useExisting: PersonService},
    {provide: 'OrganizationService', useExisting: OrganizationService},
    {provide: 'EmploymentService', useExisting: EmploymentService}
  ]
})
export class EntityServicesModule {
}
