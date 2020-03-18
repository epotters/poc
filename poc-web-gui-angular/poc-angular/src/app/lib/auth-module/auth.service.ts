import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserManager} from 'oidc-client';
import {ConfigService} from "../../app-config.service";

export {User};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly userManager: UserManager;
  private user: User | null = null;
  private readonly returnUrlKey: string = 'auth:redirect';


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
    console.debug('Silent authentication - About to set return url to ' + returnUrl || this.router.url);
    this.setReturnUrl(returnUrl || this.router.url);
    return this.userManager.signinSilent();
  }

  public startLogout(): Promise<void> {
    this.route.url.subscribe(url => {
      this.setReturnUrl(url.join('/'));
      console.info(`Return url was set to ${this.getReturnUrl()}`);
    });
    return this.userManager.signoutRedirect();
  }

  public completeLogout(): Promise<void> {
    return this.userManager.signoutRedirectCallback().then(() => {
      this.user = null;
      this.returnToUrl();
    });
  }

  public setReturnUrl(returnUrl: string): void {
    console.debug('Setting return url to ' + returnUrl);
    sessionStorage.setItem(this.returnUrlKey, returnUrl);
  }

  public getReturnUrl(): string | null {
    return sessionStorage.getItem(this.returnUrlKey);
  }

  public returnToUrl(): void {
    const returnUrl: string | null = this.getReturnUrl();
    if (!!returnUrl) {
      console.debug('Returning to URL ' + returnUrl);
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
        console.info(`User ${((!!user) ? user.profile.name : 'unknown')} loaded`);
      });
    });

    this.userManager.events.addUserUnloaded(function () {
      console.info('User unloaded');
    });

    this.userManager.events.addAccessTokenExpired(function () {
      console.info('Access token has expired');
    });

    this.userManager.events.addSilentRenewError(function () {
      console.error('Error renewing token silently');
    });

    this.userManager.events.addUserSignedOut(function () {
      console.info('User signed out');
    });
  }

  private static capitalizeFirst(text: string): string {
    return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
  }

}
