import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {OrganizationComponent} from "./organization.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {NGridModule} from "../core/n-grid/n-grid.module";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {TableFilterModule} from "../lib/entity-module/table-filter/table-filter-module";


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
    OrganizationComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationComponent,
    OrganizationListNGridComponent,
    OrganizationListOfCardsComponent
  ],
  providers: [
    PocApiService,
    OrganizationService
  ]
})
export class OrganizationModule {
}


