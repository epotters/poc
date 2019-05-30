import {Injectable} from '@angular/core';
import {User, UserManager, UserManagerSettings} from 'oidc-client';
import {Constants} from '../../../constants';

export {User};

@Injectable({
  providedIn: 'root'
})
export class AppAuthNService {

  _userManager: UserManager;

  constructor() {
    let settings: UserManagerSettings = {
      authority: Constants.stsAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}assets/signin-callback.html`,
      silent_redirect_uri: `${Constants.clientRoot}assets/silent-callback.html`,
      post_logout_redirect_uri: `${Constants.clientRoot}`,
      response_type: 'id_token token',
      scope: Constants.clientScope
    };

    let googleSettings: UserManagerSettings = {
      authority: Constants.stsAuthority,
      client_id: '762102430348-6fvj502kgk7kra04e30edbjrdf3d6hv3.apps.googleusercontent.com',
      // client_secret: '52BjJGZYj0T5eFyc_Z4GDUGf',
      redirect_uri: `${Constants.clientRoot}assets/signin-callback.html`,
      silent_redirect_uri: `${Constants.clientRoot}assets/silent-callback.html`,
      post_logout_redirect_uri: `${Constants.clientRoot}`,
      response_type: 'id_token token',
      scope: Constants.clientScope
    };


    this._userManager = new UserManager(settings);
  }

  public getUser(): Promise<User> {
    return this._userManager.getUser();
  }

  public login(): Promise<void> {
    return this._userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this._userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this._userManager.signoutRedirect();
  }
}
