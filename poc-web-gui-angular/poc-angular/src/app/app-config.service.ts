import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable, ObservableInput, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

import {CommonEnvironment, Environment} from '../environments/';
import {UserManagerSettings} from "oidc-client";


export interface AppConfig {
  production: boolean;

  externalConfig: string;

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

  private configKey: string = 'config';

  production: boolean;

  externalConfig: string;

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
    console.info('Constructing ConfigService');
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


  public isConfigStored(): boolean {
    return !!sessionStorage.sessionStorage.getItem(this.configKey);
  }

  private readConfig(): void {
    let config: AppConfig = JSON.parse(sessionStorage.getItem(this.configKey));
    this.loadConfig(config);
  }

  private storeConfig() {
    sessionStorage.setItem(this.configKey, JSON.stringify(this as AppConfig));
  }
}


// Source: https://davembush.github.io/where-to-store-angular-configurations/
export function initApp(http: HttpClient, configService: ConfigService): (() => Promise<boolean>) {

  console.info('Loading the external application configuration before the app starts');

  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get(configService.externalConfig)
        .pipe(
          map((jsonConfig: Partial<AppConfig>) => {
            console.debug('Received external configuration', jsonConfig);
            configService.loadConfig(jsonConfig);
            resolve(true);
          }),
          catchError((error: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
            if (error.status === 404) {
              console.debug('Configuration file was not found');
              resolve(false);
            }
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}


