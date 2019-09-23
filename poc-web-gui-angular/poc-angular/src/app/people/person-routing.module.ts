import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from "../lib/auth-module";
import {PersonListComponent} from "./person-list.component";
import {PersonEditorComponent} from "./person-editor.component";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {PersonManagerComponent} from "./person-manager.component";
import {PersonListOfCardsComponent} from "./person-list-of-cards.component";
import {DialogWithListDemoComponent} from "./dialog-with-component/dialog-with-list-demo.component";

const base = '';

const routes: Routes = [
  {
    path: base + 'manager',
    component: PersonManagerComponent
    // canActivate: [AuthGuardService]
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
  },
  {
    path: base + ':id',
    component: PersonEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'list-of-cards',
    component: PersonListOfCardsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'n-grid',
    component: PersonListNGridComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule {
}
