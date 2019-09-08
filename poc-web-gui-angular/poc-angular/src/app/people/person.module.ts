import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {PersonEditorComponent} from "./person-editor.component";
import {PersonListComponent} from "./person-list.component";
import {PersonService} from "./person.service";
import {PersonRoutingModule} from "./person-routing.module";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {NGridModule} from "../core/n-grid/n-grid.module";
import {PersonManagerComponent} from "./person-manager.component";
import {TableRowEditorModule} from "../lib/entity-module/table-row-editor/table-row-editor-module";
import {PersonListOfCardsComponent} from "./person-list-of-cards.component";
import {PersonEmployersRelationComponent} from "./person-employers-relation.component";


@NgModule({
  imports: [
    EntityCommonModule,
    DialogModule,
    TableRowEditorModule,

    NGridModule,
    PersonRoutingModule
  ],
  declarations: [
    PersonManagerComponent,
    PersonListComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonListNGridComponent
  ],
  entryComponents: [
    PersonManagerComponent,
    PersonListComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonListNGridComponent
  ],
  providers: [
    PocApiService,
    PersonService
  ]
})
export class PersonModule {
}


