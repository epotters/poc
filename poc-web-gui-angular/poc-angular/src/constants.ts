import {UserManagerSettings} from "oidc-client";

export class Constants {
  
  public static timezone = 'Europe/Amsterdam';
  public static locale = 'NL-NL';


  public static applicationDisplayName = 'Proof of concept in Angular';

  public static applicationBasePath = '/poc/';


  // OIDC
  public static clientRoot = 'http://localhost:4200';

  public static oidcProviderRoot = 'http://keycloak.localhost/auth/';
  public static realm = 'epo';


  // https://technology.first8.nl/add-manage-account-link-keycloak-redhat-sso/
  public static accountUrl = Constants.oidcProviderRoot + 'realms/' + Constants.realm + '/account';


  public static userManagerSettings: UserManagerSettings = {
    authority: Constants.oidcProviderRoot + 'realms/' + Constants.realm,
    client_id: 'poc-gui',
    response_type: "code",
    scope: 'openid profile email',
    redirect_uri: Constants.clientRoot + '/auth-callback',
    silent_redirect_uri: Constants.clientRoot + '/auth-silent-callback',
    post_logout_redirect_uri: Constants.clientRoot + '/auth-logout-callback',
    filterProtocolClaims: true,
    loadUserInfo: true
  };



  // API
  public static apiRoot = 'https://localhost:8002/poc/api';
}
