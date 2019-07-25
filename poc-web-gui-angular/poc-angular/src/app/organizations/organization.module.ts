import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";
import {TableFilterModule} from "../lib/entity-module/table-filter/table-filter-module";

import {PocApiService} from "../core/service";
import {NGridModule} from "../core/n-grid/n-grid.module";

import {OrganizationEditorComponent} from "./organization-editor.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {OrganizationSelectorComponent} from "./organization-selector.component";
import {OrganizationEmployeesRelationComponent} from "./organization-employees-relation.component";

import {EmploymentModule} from "../employments/employment.module";


@NgModule({
  imports: [
    EntityCommonModule,
    NGridModule,
    DialogModule,
    TableFilterModule,
    OrganizationRoutingModule,
    EmploymentModule
  ],
  declarations: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeesRelationComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent,
    OrganizationSelectorComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeesRelationComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent,
    OrganizationSelectorComponent
  ],
  providers: [
    PocApiService,
    OrganizationService]
})
export class OrganizationModule {
}


