export class Constants {

  public static applicationDisplayName = 'Proof of concept in Angular';

  // OIDC
  public static oidcAuthority = 'http://keycloak.localhost/auth/realms/epo';
  public static clientId = 'poc-gui';
  public static clientRoot = 'http://localhost:4200/';
  public static clientScope = 'openid profile email';

  public static redirectUri = Constants.clientRoot + 'auth-callback';

  public static silentRedirectUri = Constants.clientRoot + 'assets/silent-callback.html';

  // API
  public static apiRoot = 'https://localhost:8002/poc/api';
}
