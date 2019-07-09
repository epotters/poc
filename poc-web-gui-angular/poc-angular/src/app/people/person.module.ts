import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";


import {ApiService} from "../core/service";
import {PersonComponent} from "./person.component";
import {PersonListComponent} from "./person-list.component";
import {PersonService} from "./person.service";
import {PersonRoutingModule} from "./person-routing.module";
import {DialogModule} from "../lib/entity-module/dialog.module";


@NgModule({
  imports: [
    EntityCommonModule,
    DialogModule,
    PersonRoutingModule
  ],
  declarations: [
    PersonListComponent,
    PersonComponent
  ],
  entryComponents: [
    PersonListComponent,
    PersonComponent
  ],
  providers: [
    ApiService,
    PersonService
  ]
})
export class PersonModule {
}


