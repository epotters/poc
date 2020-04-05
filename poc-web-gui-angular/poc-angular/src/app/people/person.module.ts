import {NgModule} from '@angular/core';
import {EmploymentModule} from '../employments/employment.module';
import {META, SERVICE} from '../lib/entity-lib/entity-tokens';

import {EntityModule} from '../lib/entity-lib/entity.module';
import {PersonDemoComponent} from './person-demo.component';
import {PersonDetailComponent} from './person-detail.component';
import {PersonEditorComponent, PersonEmployersRelationComponent} from './person-editor.component';
import {PersonListOfCardsComponent} from './person-list-of-cards.component';
import {PersonListComponent} from './person-list.component';
import {PersonManagerComponent} from './person-manager.component';
import {personMeta} from './person-meta';
import {PersonRoutingModule} from './person-routing.module';
import {PersonService} from './person.service';


@NgModule({
  imports: [
    EntityModule,
    PersonRoutingModule,
    EmploymentModule
  ],
  declarations: [
    PersonManagerComponent,
    PersonListComponent,
    PersonDetailComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonDemoComponent
  ],
  entryComponents: [
    PersonManagerComponent,
    PersonListComponent,
    PersonDetailComponent,
    PersonEditorComponent,
    PersonEmployersRelationComponent,
    PersonListOfCardsComponent,
    PersonDemoComponent
  ],
  providers: [
    {provide: META, useValue: personMeta},
    {provide: SERVICE, useExisting: PersonService}
  ]
})
export class PersonModule {
}


