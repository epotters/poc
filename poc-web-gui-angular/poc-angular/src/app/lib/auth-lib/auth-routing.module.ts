import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthLoginComponent} from './auth-login.component';
import {AuthLogoutComponent} from './auth-logout.component';

import {AuthLoginCallbackComponent} from './auth-login-callback.component';
import {AuthLogoutCallbackComponent} from './auth-logout-callback.component';
import {AuthGuardService} from './auth-guard.service';


const routes: Routes = [
  {
    path: 'auth-login',
    component: AuthLoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'auth-logout',
    component: AuthLogoutComponent
  },
  {
    path: 'account',
    component: AuthLoginComponent,
    resolve: {
      url: 'accountUrlRedirectResolver'
    }
  },
  {
    path: 'auth-callback',
    component: AuthLoginCallbackComponent
  },
  {
    path: 'auth-logout-callback',
    component: AuthLogoutCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

