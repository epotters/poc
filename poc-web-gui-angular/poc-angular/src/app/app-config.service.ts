import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable, ObservableInput, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

import {CommonEnvironment, Environment} from '../environments/';
import {UserManagerSettings} from "oidc-client";


export interface AppConfig {
  production: boolean;

  timezone: string;
  locale: string;

  applicationDisplayName: string;
  applicationBasePath: string;

  clientRoot: string;

  // API
  apiRoot: string;

  // OIDC authentication
  oidcProviderRoot: string;
  realm: string;
  clientId: string;
  accountUrl: string;
  userManagerSettings: UserManagerSettings;

  // GUI
  defaultSnackbarDuration: number;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService implements AppConfig {

  production: boolean;

  timezone: string;
  locale: string;

  applicationDisplayName: string;
  applicationBasePath: string;
  clientRoot: string;

  apiRoot: string;

  oidcProviderRoot: string;
  realm: string;
  clientId: string;
  accountUrl: string;
  userManagerSettings: UserManagerSettings;

  defaultSnackbarDuration: number;

  constructor() {
    console.info('Costructing ConfigService');
    this.loadConfig(CommonEnvironment);
    this.loadConfig(Environment);
  }


  public loadConfig(partialConfig: Partial<AppConfig>): void {
    for (let [key, value] of Object.entries(partialConfig)) {
        this[key] = value;
    }
    this.accountUrl = this.oidcProviderRoot + 'realms/' + this.realm + '/account';
    this.userManagerSettings = this.buildUserManagerSettings();
  }


  private buildUserManagerSettings(): UserManagerSettings {
    return {
      authority: this.oidcProviderRoot + 'realms/' + this.realm,
      client_id: this.clientId,
      response_type: "code",
      scope: 'openid profile email',
      redirect_uri: this.clientRoot + '/auth-callback',
      silent_redirect_uri: this.clientRoot + '/auth-silent-callback',
      post_logout_redirect_uri: this.clientRoot + '/auth-logout-callback',
      filterProtocolClaims: true,
      loadUserInfo: true
    };
  }
}


// Source: https://davembush.github.io/where-to-store-angular-configurations/
export function initApp(http: HttpClient, configService: ConfigService): (() => Promise<boolean>) {

  const jsonUrl: string = './poc/config/poc-config.json';
  console.info('Loading the external application configuration before the app starts');

  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get(jsonUrl)
        .pipe(
          map((jsonConfig: Partial<AppConfig>) => {
            console.debug('Received poc.json', jsonConfig);
            configService.loadConfig(jsonConfig);
            resolve(true);
          }),
          catchError((error: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
            if (error.status === 404) {
              console.debug('Configuration file poc-config.json was not found');
              resolve(false);
            }
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}


