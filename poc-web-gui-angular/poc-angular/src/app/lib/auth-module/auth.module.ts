import {NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

import {AuthRoutingModule} from "./auth-routing.module";

import {AuthLoginComponent} from "./auth-login.component";
import {AuthLogoutComponent} from "./auth-logout.component";
import {AuthLoginCallbackComponent} from "./auth-login-callback.component";
import {AuthSilentCallbackComponent} from "./auth-silent-callback.component";
import {AuthLogoutCallbackComponent} from "./auth-logout-callback.component";

import {AuthGuardService} from "./auth-guard.service";
import {AuthService} from "./auth.service";

@NgModule({
  imports: [AuthRoutingModule],
  declarations: [
    AuthLoginComponent,
    AuthLogoutComponent,
    AuthLoginCallbackComponent,
    AuthSilentCallbackComponent,
    AuthLogoutCallbackComponent
  ],
  entryComponents: [
    AuthLoginComponent,
    AuthLogoutComponent,
    AuthLoginCallbackComponent,
    AuthSilentCallbackComponent,
    AuthLogoutCallbackComponent
  ],
  providers: [
    AuthGuardService,
    AuthService, {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        window.location.href = (route.data as any).externalUrl;
      }
    }]

})
export class AuthModule {
}
