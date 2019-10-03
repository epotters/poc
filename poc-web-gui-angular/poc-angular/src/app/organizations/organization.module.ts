import {NgModule} from '@angular/core';

import {EntityModule} from "../lib/entity-module/entity.module";

import {OrganizationEditorComponent, OrganizationEmployeesRelationComponent} from "./organization-editor.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {organizationMeta} from "./organization-meta";
import {META, SERVICE} from "../lib/entity-module/entity-tokens";
import {EmploymentModule} from "../employments/employment.module";


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
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeesRelationComponent,
    OrganizationListNGridComponent,
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


