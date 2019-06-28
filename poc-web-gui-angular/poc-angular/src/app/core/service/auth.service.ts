import {Injectable} from '@angular/core';
import {User, UserManager, UserManagerSettings} from 'oidc-client';
import {Constants} from '../../../constants';

export {User};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userManager: UserManager;
  private user: User;

  constructor() {

    let settings: UserManagerSettings = {
      authority: Constants.oidcAuthority,
      client_id: Constants.clientId,
      redirect_uri: Constants.redirectUri,
      silent_redirect_uri: Constants.silentRedirectUri,
      post_logout_redirect_uri: Constants.clientRoot,
      response_type: "code",
      scope: Constants.clientScope,
      filterProtocolClaims: true,
      loadUserInfo: true
      // , userStore: new WebStorageStateStore({ store: window.localStorage })
    };


    this.userManager = new UserManager(settings);

    this.userManager.getUser().then(user => {
      this.user = user;
    });

  }


  ///

  // public getUser(): Promise<User> {
  //   return this.userManager.getUser();
  // }
  //
  // public login(): Promise<void> {
  //   return this.userManager.signinRedirect();
  // }
  //
  // public renewToken(): Promise<User> {
  //   return this.userManager.signinSilent();
  // }
  //
  // public logout(): Promise<void> {
  //   return this.userManager.signoutRedirect();
  // }


  // Source: https://www.scottbrady91.com/Angular/SPA-Authentiction-using-OpenID-Connect-Angular-CLI-and-oidc-client

  public isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  public getClaims(): any {
    return this.user.profile;
  }

  public getAuthorizationHeaderValue(): string {
    // return `${this.user.token_type} ${this.user.access_token}`;
    return 'Bearer ' + this.user.access_token;
  }

  public startAuthentication(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public completeAuthentication(): Promise<void> {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
    });
  }
}
