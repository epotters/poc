import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserManagerSettings} from 'oidc-client';

import {Observable, ObservableInput, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {CommonEnvironment, Environment} from '../environments/';


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

  [index: string]: any;

  production!: boolean;
  externalConfig!: string;
  timezone!: string;
  locale!: string;
  applicationDisplayName!: string;
  applicationBasePath!: string;
  clientRoot!: string;
  apiRoot!: string;
  oidcProviderRoot!: string;
  realm!: string;
  clientId!: string;
  accountUrl!: string;
  userManagerSettings!: UserManagerSettings;
  defaultSnackbarDuration!: number;

  // TODO: use code to enable config caching
  private readonly configKey: string = 'config';


  constructor() {
    console.info('Constructing ConfigService');
    this.loadConfig(CommonEnvironment);
    this.loadConfig(Environment);
  }


  public loadConfig(partialConfig: Partial<AppConfig>): void {
    for (const [key, value] of Object.entries(partialConfig)) {
      this[key] = value;
    }
    this.accountUrl = this.oidcProviderRoot + 'realms/' + this.realm + '/account';
    this.userManagerSettings = this.buildUserManagerSettings();
  }


  private buildUserManagerSettings(): UserManagerSettings {
    return {
      authority: `${this.oidcProviderRoot}realms/${this.realm}`,
      client_id: this.clientId,
      response_type: 'code',
      scope: 'openid profile email',
      redirect_uri: `${this.clientRoot}/auth-callback`,
      automaticSilentRenew: true, // Advised against by the authors of oidc-client
      silent_redirect_uri: `${location.protocol}//${location.host}/assets/auth-silent-refresh-callback.html`,
      post_logout_redirect_uri: `${this.clientRoot}/auth-logout-callback`,
      // for silent: post_logout_redirect_uri: `${location.protocol}//${location.host}/assets/auth-silent-logout-callback.html`,
      filterProtocolClaims: true,
      loadUserInfo: true
    };
  }


  public isConfigStored(): boolean {
    return !!sessionStorage.sessionStorage.getItem(this.configKey);
  }


  private readConfig(): void {
    const json: string | null = sessionStorage.getItem(this.configKey);
    if (!!json) {
      try {
        const config: AppConfig = JSON.parse(json);
        this.loadConfig(config);
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(error.name);
        } else {
          console.error(error.message);
        }
      }
    }
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


