import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {PersonComponent} from "./person.component";
import {PersonListComponent} from "./person-list.component";
import {PersonService} from "./person.service";
import {PersonRoutingModule} from "./person-routing.module";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {NGridModule} from "../core/n-grid/n-grid.module";


@NgModule({
  imports: [
    EntityCommonModule,
    NGridModule,
    DialogModule,
    PersonRoutingModule
  ],
  declarations: [
    PersonListComponent,
    PersonComponent,
    PersonListNGridComponent
  ],
  entryComponents: [
    PersonListComponent,
    PersonComponent,
    PersonListNGridComponent
  ],
  providers: [
    PocApiService,
    PersonService
  ]
})
export class PersonModule {
}


