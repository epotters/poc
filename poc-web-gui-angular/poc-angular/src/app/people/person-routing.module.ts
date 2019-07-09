import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PersonListComponent} from "./person-list.component";
import {PersonComponent} from "./person.component";
import {AuthGuardService} from "../lib/auth-module";
import {PersonMeta} from "./person-meta";

const meta = new PersonMeta();

const routes: Routes = [
  {
    path: meta.namePlural,
    component: PersonListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/new',
    component: PersonComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id',
    component: PersonComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule {
}
