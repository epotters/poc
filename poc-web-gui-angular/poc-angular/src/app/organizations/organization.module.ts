import {NgModule} from '@angular/core';

import {EmploymentModule} from '../employments/employment.module';
import {META, SERVICE} from '../lib/entity-lib/entity-tokens';
import {EntityModule} from '../lib/entity-lib/entity.module';
import {OrganizationEditorComponent, OrganizationEmployeesRelationComponent} from './organization-editor.component';
import {OrganizationListOfCardsComponent} from './organization-list-of-cards.component';
import {OrganizationListComponent} from './organization-list.component';
import {OrganizationManagerComponent} from './organization-manager.component';
import {organizationMeta} from './organization-meta';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrganizationService} from './organization.service';


@NgModule({
  imports: [
    EntityModule,
    OrganizationRoutingModule,
    EmploymentModule
  ],
  declarations: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeesRelationComponent,
    OrganizationListOfCardsComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeesRelationComponent,
    OrganizationListOfCardsComponent
  ],
  exports: [
    OrganizationListComponent
  ],
  providers: [
    {provide: META, useValue: organizationMeta},
    {provide: SERVICE, useExisting: OrganizationService}
  ]
})
export class OrganizationModule {
}


