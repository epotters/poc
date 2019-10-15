import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Observable, ObservableInput, of} from "rxjs";
import {Config} from "../config";
import {UserManagerSettings} from "oidc-client";



export interface AppConfig {

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
  accountUrl: string;
  userManagerSettings: UserManagerSettings;

  // GUI
  defaultSnackbarDuration: number;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // timezone: string;
  // locale: string;
  //
  // applicationDisplayName: string;
  // applicationBasePath: string;
  //
  // clientRoot: string;
  // apiRoot: string;
  // oidcProviderRoot: string;
  //
  //
  // realm: string;
  // accountUrl: string;
  // userManagerSettings: UserManagerSettings;
  //
  // defaultSnackbarDuration: number;


  constructor() {
    // this.loadDefaults();
  }


  // public loadDefaults(): void {
  //   this.clientRoot = Config.clientRoot;
  //   this.apiRoot = Config.apiRoot;
  //   this.oidcProviderRoot = Config.oidcProviderRoot;
  //   this.timezone = Config.timezone;
  //   this.locale = Config.locale;
  //   this.applicationBasePath = Config.applicationBasePath;
  //   this.realm = Config.realm;
  //   this.userManagerSettings = Config.userManagerSettings;
  //   this.defaultSnackbarDuration = Config.defaultSnackbarDuration;
  // }


  public loadConfig(partialConfig: Partial<AppConfig>): void {

    console.debug('Loading configuration...', partialConfig);
    Config.clientRoot = partialConfig.clientRoot;
    Config.apiRoot = partialConfig.apiRoot;
    Config.oidcProviderRoot = partialConfig.oidcProviderRoot;

    Config.accountUrl =   Config.oidcProviderRoot + 'realms/' + Config.realm + '/account';
    Config.userManagerSettings = ConfigService.buildUserManagerSettings();
  }


  private static buildUserManagerSettings(): UserManagerSettings {
    return {
      authority: Config.oidcProviderRoot + 'realms/' + Config.realm,
      client_id: 'poc-gui',
      response_type: "code",
      scope: 'openid profile email',
      redirect_uri: Config.clientRoot + '/auth-callback',
      silent_redirect_uri: Config.clientRoot + '/auth-silent-callback',
      post_logout_redirect_uri: Config.clientRoot + '/auth-logout-callback',
      filterProtocolClaims: true,
      loadUserInfo: true
    };
  }
}


// Source: https://davembush.github.io/where-to-store-angular-configurations/

export function initApp(http: HttpClient, configService: ConfigService): (() => Promise<boolean>) {

  const jsonUrl: string = './poc/config/poc-config.json';
  console.debug('Trying to load the application configuration poc-config.json before the app starts');

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
            if (error.status !== 404) {
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


