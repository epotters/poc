import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {OrganizationEditorComponent} from "./organization-editor.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {NGridModule} from "../core/n-grid/n-grid.module";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {TableFilterModule} from "../lib/entity-module/table-filter/table-filter-module";
import {OrganizationEmployeeListComponent} from "./employees/organization-employees-list.component";
import {OrganizationEmployeeService} from "./employees/organization-employee.service";
import {OrganizationEmployeeEditorComponent} from "./employees/organization-employee-editor.component";
import {OrganizationSelectorComponent} from "./organization-selector.component";


@NgModule({
  imports: [
    EntityCommonModule,
    NGridModule,
    DialogModule,
    TableFilterModule,
    OrganizationRoutingModule
  ],
  declarations: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeeListComponent,
    OrganizationEmployeeEditorComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent,
    OrganizationSelectorComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationEditorComponent,
    OrganizationEmployeeListComponent,
    OrganizationEmployeeEditorComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent,
    OrganizationSelectorComponent
  ],
  providers: [
    PocApiService,
    OrganizationService,
    OrganizationEmployeeService
  ]
})
export class OrganizationModule {
}


