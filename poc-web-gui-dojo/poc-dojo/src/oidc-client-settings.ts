import {UserManagerSettings} from "oidc-client";


export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'http://localhost:5555/',
    client_id: 'angular_spa',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: "code",
    scope: "openid profile api1",
    filterProtocolClaims: true,
    loadUserInfo: true
  };
}
