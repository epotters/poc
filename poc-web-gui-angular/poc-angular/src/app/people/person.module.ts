import {NgModule} from '@angular/core';

import {EntityModule} from "../lib/entity-module/entity.module";

import {PersonService} from "./person.service";
import {PersonEditorComponent} from "./person-editor.component";
import {PersonListComponent} from "./person-list.component";
import {PersonRoutingModule} from "./person-routing.module";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {PersonManagerComponent} from "./person-manager.component";
import {PersonListOfCardsComponent} from "./person-list-of-cards.component";
import {PersonEmployersRelationComponent} from "./person-employers-relation.component";
import {personMeta} from "./person-meta";
import {META, SERVICE} from "../lib/entity-module/entity-tokens";


import {DialogWithListDemoComponent} from "./dialog-with-component/dialog-with-list-demo.component";


@NgModule({
  imports: [
    EntityModule,
    PersonRoutingModule
  ],
  declarations: [
    PersonManagerComponent,
    PersonListComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonListNGridComponent,
    DialogWithListDemoComponent
  ],
  entryComponents: [
    PersonManagerComponent,
    PersonListComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonListNGridComponent,
    DialogWithListDemoComponent
  ],
  providers: [
    {provide: META, useValue: personMeta},
    {provide: SERVICE, useExisting: PersonService}
  ]
})
export class PersonModule {
}


