import {UserManagerSettings} from "oidc-client";


export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'http://keycloak.localhost',
    client_id: 'poc-api',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: "code",
    scope: "openid profile poc",
    filterProtocolClaims: true,
    loadUserInfo: true
  };
}
