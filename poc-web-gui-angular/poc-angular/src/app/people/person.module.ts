import {NgModule} from '@angular/core';

import {EntityModule} from "../lib/entity-module/entity.module";

import {PersonService} from "./person.service";
import {PersonEditorComponent, PersonEmployersRelationComponent} from "./person-editor.component";
import {PersonListComponent} from "./person-list.component";
import {PersonRoutingModule} from "./person-routing.module";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {PersonManagerComponent} from "./person-manager.component";
import {PersonListOfCardsComponent} from "./person-list-of-cards.component";
import {personMeta} from "./person-meta";
import {META, SERVICE} from "../lib/entity-module/entity-tokens";
import {EmploymentModule} from "../employments/employment.module";


@NgModule({
  imports: [
    EntityModule,
    PersonRoutingModule,
    EmploymentModule
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
    {provide: META, useValue: personMeta},
    {provide: SERVICE, useExisting: PersonService}
  ]
})
export class PersonModule {
}


