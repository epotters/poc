import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {User, UserManager, UserManagerSettings} from 'oidc-client';


import {ConfigService} from '../../app-config.service';

export {User};

export interface AuthConfig {
  userManagerSettings: UserManagerSettings;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly userManager: UserManager;
  private user: User | null = null;
  private readonly returnUrlKey: string = 'auth:redirect';
  private readonly logDateFormat: string = 'YYYY-MM-DD HH:mm:ss';
  private readonly logoutFrameId = 'logout-frame';

  // TODO: Get Rid of the ConfigService dependency
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService) {
    console.info('Constructing the AuthService');
    this.userManager = new UserManager(config.userManagerSettings);
    this.registerEventlisteners();
  }

  // Source: https://www.scottbrady91.com/Angular/SPA-Authentiction-using-OpenID-Connect-Angular-CLI-and-oidc-client
  public isLoggedIn(): boolean {
    return !!this.user && !this.user.expired;
  }

  public isExpired(): boolean {
    return !!this.user && this.user.expired;
  }

  public getClaims(): any {
    if (!!this.user && !!this.user.profile) {
      return this.user.profile;
    } else {
      return null;
    }
  }

  public getAuthorizationHeaderValue(): string | null {
    if (!!this.user) {
      // Bearer is case sensitive, token_type is lowercase, doesn't work
      return AuthService.capitalizeFirst(this.user.token_type) + ' ' + this.user.access_token;
    } else {
      return null;
    }
  }

  public startAuthentication(returnUrl: string): Promise<void> {
    this.setReturnUrl(returnUrl);
    return this.userManager.signinRedirect();
  }

  public completeAuthentication(): Promise<void> {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
      console.debug('Authentication completed');
      this.returnToUrl();
    });
  }

  public startSilentAuthentication(returnUrl?: string): Promise<User> {
    console.debug(`Silent authentication - About to set return url to "${returnUrl || this.router.url}"`);
    this.setReturnUrl(returnUrl || this.router.url);
    return this.userManager.signinSilent();
  }

  public startLogout(): Promise<void> {
    this.route.url.subscribe(url => {
      this.setReturnUrl(url.join('/'));
      console.info(`Return url was set to "${this.getReturnUrl()}"`);
    });
    return this.userManager.signoutRedirect();
  }

  public completeLogout(): Promise<void> {
    return this.userManager.signoutRedirectCallback().then(() => {
      this.user = null;
      this.returnToUrl();
    });
  }

  public startSilentLogout() {
    this.userManager.createSignoutRequest().then(signoutRequest => {
      console.debug(`Signout URL is "${signoutRequest.url}"`);
      const iframe: HTMLIFrameElement | null = this.getSessionStatusFrame();
      if (iframe) {
        iframe.setAttribute('src', signoutRequest.url);
      } else {
        console.warn('Session status iframe not found');
      }
    });
  }

  private getSessionStatusFrame(): HTMLIFrameElement | null {
    let sessionStatusFrame: HTMLIFrameElement | null = null;
    const iframes: NodeListOf<HTMLIFrameElement> = document.querySelectorAll('iframe');
    iframes.forEach((iframe, idx) => {
      if (iframe.getAttribute('src')!.indexOf('login-status-iframe.html') > 0) {
        sessionStatusFrame = iframe;
      }
    });
    return sessionStatusFrame;
  }

  private getLogoutFrame(): HTMLIFrameElement {
    let iframe: HTMLElement | null = document.getElementById(this.logoutFrameId);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.setAttribute('id', this.logoutFrameId);
      iframe.setAttribute('class', 'hidden-frame');
      document.body.append(iframe);
      iframe.addEventListener('load', (event) => {
        console.debug('Logout frame load event from parent', event);
        this.userManager.removeUser().then(() => {
          console.debug('UserManager user removed');
          this.user = null;
          this.returnToUrl();
        });
      });
    }
    return (iframe as HTMLIFrameElement);
  }

  public setReturnUrl(returnUrl: string): void {
    console.debug(`Setting return url to "${returnUrl}"`);
    sessionStorage.setItem(this.returnUrlKey, returnUrl);
  }

  public getReturnUrl(): string | null {
    return sessionStorage.getItem(this.returnUrlKey);
  }

  public returnToUrl(): void {
    const returnUrl: string | null = this.getReturnUrl();
    if (!!returnUrl) {
      console.debug(`Returning to URL "${returnUrl}"`);
      sessionStorage.removeItem(this.returnUrlKey);
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate(['']);
    }
  }


  private registerEventlisteners() {

    this.userManager.events.addUserLoaded(() => {
      this.userManager.getUser().then(user => {
        this.user = user;
        console.info(this.prependDate(`User "${((!!user) ? user.profile.name : 'unknown')}" loaded. ` +
          `User session has been established (or re-established)`));
      });
    });

    this.userManager.events.addUserSessionChanged(() => {
      console.info(this.prependDate('User session changed'));
    });

    this.userManager.events.addAccessTokenExpiring(() => {
      console.info(this.prependDate('Access token is about to expire'));
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.info(this.prependDate('Access token has expired'));
    });

    this.userManager.events.addSilentRenewError(() => {
      console.info(this.prependDate('The automatic silent renew failed. Redirect to login page.'));
      this.startAuthentication(this.router.url);
    });

    this.userManager.events.addUserSignedOut(() => {
      console.info(this.prependDate('User signed out. The user\'s sign-in status at the OIDC Provider has changed'));
    });

    this.userManager.events.addUserUnloaded(() => {
      console.info(this.prependDate('User unloaded. The user\'s session has been terminated'));
    });
  }

  private static capitalizeFirst(text: string): string {
    return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
  }

  private prependDate(msg: string) {
    return `${moment().format(this.logDateFormat)}: ${msg}`;
  }

}
