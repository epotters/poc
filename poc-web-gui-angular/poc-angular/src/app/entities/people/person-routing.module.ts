import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from '@epotters/auth';
import {PersonDemoComponent} from './person-demo.component';
import {PersonEditorComponent} from './person-editor.component';
import {PersonListOfCardsComponent} from './person-list-of-cards.component';
import {PersonListComponent} from './person-list.component';
import {PersonManagerComponent} from './person-manager.component';

const base = '';

const routes: Routes = [
  {
    path: base + 'manager',
    component: PersonManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base,
    component: PersonListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'new',
    component: PersonEditorComponent,
    canActivate: [AuthGuardService]
  }, {
    path: base + 'cards',
    component: PersonListOfCardsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'demo',
    component: PersonDemoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + ':id',
    component: PersonEditorComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule {
}
