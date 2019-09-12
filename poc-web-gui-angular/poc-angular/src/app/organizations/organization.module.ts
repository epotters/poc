import {NgModule} from '@angular/core';

import {EntityModule} from "../lib/entity-module/entity.module";

import {OrganizationEditorComponent} from "./organization-editor.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {OrganizationEmployeesRelationComponent} from "./organization-employees-relation.component";
import {organizationMeta} from "./organization-meta";
import {META, SERVICE} from "../lib/entity-module/entity-tokens";


@NgModule({
  imports: [
    EntityModule,
    OrganizationRoutingModule
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
  providers: [
    {provide: META, useValue: organizationMeta},
    {provide: SERVICE, useExisting: OrganizationService}
  ]
})
export class OrganizationModule {
}


