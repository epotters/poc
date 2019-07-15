import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PersonListComponent} from "./person-list.component";
import {PersonComponent} from "./person.component";
import {AuthGuardService} from "../lib/auth-module";
import {personMeta} from "./person-meta";
import {PersonListNGridComponent} from "./person-list-n-grid.component";
import {OrganizationManagerComponent} from "../organizations/organization-manager.component";
import {PersonManagerComponent} from "./person-manager.component";

const meta = personMeta;

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
  },
  {
    path: meta.namePlural + '-manager',
    component: PersonManagerComponent,
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
