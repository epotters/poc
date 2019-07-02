import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {ConfirmationDialogComponent} from "../lib/entity-module";


import {ApiService} from "../core/service";
import {OrganizationComponent} from "./organization.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";


@NgModule({
  imports: [
    EntityCommonModule,
    OrganizationRoutingModule
  ],
  declarations: [
    OrganizationListComponent,
    OrganizationComponent,
    ConfirmationDialogComponent
  ],
  entryComponents: [
    OrganizationListComponent,
    OrganizationComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    ApiService,
    OrganizationService
  ]
})
export class OrganizationModule {
}


