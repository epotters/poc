import {UserManagerSettings} from "oidc-client";

export class Config {

  public static timezone = 'Europe/Amsterdam';
  public static locale = 'NL-NL';

  public static applicationDisplayName = 'Proof of concept in Angular';
  public static applicationBasePath = '/poc/';

  // API
  public static apiRoot = 'https://localhost:8002/poc/api';


  // OIDC authentication
  public static clientRoot = 'http://localhost:4200/poc';

  public static oidcProviderRoot = 'http://keycloak.localhost/auth/';
  public static realm = 'epo';
  public static accountUrl = Config.oidcProviderRoot + 'realms/' + Config.realm + '/account';

  public static userManagerSettings: UserManagerSettings = {
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


  public static defaultSnackbarDuration: number = 3000;

}

export const POC_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

