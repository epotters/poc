import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PeopleListComponent} from './people-list.component';
import {PersonComponent} from "./person.component";
import {AuthGuardService} from "../lib/auth-module/auth-guard.service";

const routes: Routes = [
  {
    path: 'people',
    component: PeopleListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'people/new',
    component: PersonComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'people/:id',
    component: PersonComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule {
}
