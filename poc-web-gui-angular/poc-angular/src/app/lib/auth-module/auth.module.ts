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
import {ConfigService} from "../../app-config.service";


export interface RouteData {
  externalUrl: string;
  queryParams: QueryParams;
}

export interface QueryParams {
  [index: string]: any;
  referer: string;
  referrer_uri: string;
}

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
      provide: 'accountUrlRedirectResolver',
      deps: [ConfigService],
      useFactory: (config: ConfigService) => {
        let routeData: RouteData = {
          externalUrl: config.accountUrl,
          queryParams: {
            referer: config.clientRoot,
            referrer_uri: config.clientRoot + config.applicationBasePath
          }
        };
        let url = routeData.externalUrl;
        if (routeData.queryParams) {
          let isFirst = true;
          for (let key in routeData.queryParams) {
            if (routeData.queryParams.hasOwnProperty(key)) {
              let value = routeData.queryParams[key];
              url += ((isFirst) ? '?' : '&') + key + '=' + value;
              isFirst = false;
            }
          }
        }
        window.location.href = url;
      }
    }]

})
export class AuthModule {
}
