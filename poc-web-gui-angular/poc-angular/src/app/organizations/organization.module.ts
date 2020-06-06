import {NgModule} from '@angular/core';
import {EntityModule}  from '@epotters/entities';

import {EmploymentModule} from '../employments/employment.module';
import {OrganizationEditorComponent, OrganizationEmployeesRelationComponent} from './organization-editor.component';
import {OrganizationListOfCardsComponent} from './organization-list-of-cards.component';
import {OrganizationListComponent} from './organization-list.component';
import {OrganizationManagerComponent} from './organization-manager.component';
import {OrganizationRoutingModule} from './organization-routing.module';


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
  ]
})
export class OrganizationModule {
}


