import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from "../lib/auth-module";
import {personMeta} from "./person-meta";
import {PersonListComponent} from "./person-list.component";
import {PersonEditorComponent} from "./person-editor.component";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {PersonManagerComponent} from "./person-manager.component";
import {PersonListOfCardsComponent} from "./person-list-of-cards.component";

const meta = personMeta;

const routes: Routes = [
  {
    path: meta.namePlural,
    component: PersonListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/new',
    component: PersonEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id',
    component: PersonEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-manager',
    component: PersonManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-list-of-cards',
    component: PersonListOfCardsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-n-grid',
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
