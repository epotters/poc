import {NgModule} from '@angular/core';
import {EntityModule}  from '@epotters/entities';
import {EmploymentModule} from '../employments/employment.module';
import {PersonDemoComponent} from './person-demo.component';
import {PersonDetailComponent} from './person-detail.component';
import {PersonEditorComponent, PersonEmployersRelationComponent} from './person-editor.component';
import {PersonListOfCardsComponent} from './person-list-of-cards.component';
import {PersonListComponent} from './person-list.component';
import {PersonManagerComponent} from './person-manager.component';
import {PersonRoutingModule} from './person-routing.module';


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
  ]
})
export class PersonModule {
}


