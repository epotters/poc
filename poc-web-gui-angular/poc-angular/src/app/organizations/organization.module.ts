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


@NgModule({
  imports: [
    EntityCommonModule,
    NGridModule,
    DialogModule,
    OrganizationRoutingModule
  ],
  declarations: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationListNGridComponent,
    OrganizationComponent
  ],
  entryComponents: [
    OrganizationManagerComponent,
    OrganizationListComponent,
    OrganizationListNGridComponent,
    OrganizationComponent
  ],
  providers: [
    PocApiService,
    OrganizationService
  ]
})
export class OrganizationModule {
}


