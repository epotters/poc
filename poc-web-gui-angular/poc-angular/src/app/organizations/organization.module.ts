import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog.module";

import {ApiService} from "../core/service";
import {OrganizationComponent} from "./organization.component";
import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationService} from "./organization.service";
import {OrganizationRoutingModule} from "./organization-routing.module";


@NgModule({
  imports: [
    EntityCommonModule,
    DialogModule,
    OrganizationRoutingModule
  ],
  declarations: [
    OrganizationListComponent,
    OrganizationComponent
  ],
  entryComponents: [
    OrganizationListComponent,
    OrganizationComponent
  ],
  providers: [
    ApiService,
    OrganizationService
  ]
})
export class OrganizationModule {
}


