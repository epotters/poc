import {NgModule} from '@angular/core';
import {EmploymentService} from '../../employments/employment.service';
import {OrganizationService} from '../../organizations/organization.service';
import {PersonService} from '../../people/person.service';


@NgModule({
  providers: [
    {provide: 'PersonService', useExisting: PersonService},
    {provide: 'OrganizationService', useExisting: OrganizationService},
    {provide: 'EmploymentService', useExisting: EmploymentService}
  ]
})
export class EntityServicesModule {
}
