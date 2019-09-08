import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";
import {TableRowEditorModule} from "../lib/entity-module/table-row-editor/table-row-editor-module";

import {PocApiService} from "../core/service";
import {NGridModule} from "../core/n-grid/n-grid.module";

import {OrganizationEditorComponent} from "./organization-editor.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {OrganizationEmployeesRelationComponent} from "./organization-employees-relation.component";

import {EmploymentModule} from "../employments/employment.module";


@NgModule({
  imports: [
    EntityCommonModule,
    NGridModule,
    DialogModule,
    TableRowEditorModule,
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
  providers: [
    PocApiService,
    OrganizationService]
})
export class OrganizationModule {
}


