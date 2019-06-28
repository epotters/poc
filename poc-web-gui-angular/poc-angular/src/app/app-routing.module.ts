import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from "./core/service/auth-guard.service";
import {AuthCallbackComponent} from "./auth-callback/auth-callback.component";

import {HomeComponent} from "./home/home.component";
import {PeopleListComponent} from "./people/people-list.component";


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'people',
    component: PeopleListComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
