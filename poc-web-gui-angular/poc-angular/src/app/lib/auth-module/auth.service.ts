import {Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Profile, User, UserManager} from 'oidc-client';
import {ConfigService} from "../../app-config.service";

export {User};

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private readonly userManager: UserManager;
  private user: User | null = null;
  private readonly returnUrlKey: string = 'auth:redirect';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService) {
    console.info('Constructing the AuthService');
    this.userManager = new UserManager(config.userManagerSettings);
  }

  ngOnInit(): void {
    this.userManager.getUser().then(user => {
      this.user = user;
    });
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
      this.returnToUrl();
    });
  }

  public startSilentAuthentication(returnUrl?: string): Promise<User> {
    console.debug('Silent authentication - About to set return url to ' + returnUrl || this.router.url);
    this.setReturnUrl(returnUrl || this.router.url);
    return this.userManager.signinSilent();
  }

  public completeSilentAuthentication(): Promise<void> {
    return this.userManager.signinSilentCallback().then(user => {
      console.debug('user:', user);
      this.user = (!!user) ? user : null;
      console.info('Silent Authentication completed: User set to "' + ((!!this.user) ? this.user.profile.name : 'unknown') + '"');
      // console.debug('Is returnToUrl needed here or is the callback page loaded in the iframe?');
      // this.returnToUrl();
    });
  }

  public startLogout(): Promise<void> {
    this.route.url.subscribe(url => {
      console.debug(url);
      console.log('About to set return url for logout to: ' + url.join('/'));
      this.setReturnUrl(url.join('/'));
      console.debug('Return url was set to ' + this.getReturnUrl());
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
    this.userManager.events.addUserLoaded(function () {
      console.info('User loaded');
    });

    this.userManager.events.addUserUnloaded(function () {
      console.info('User unloaded');
    });

    this.userManager.events.addAccessTokenExpired(function () {
      console.info('Your access token has expired');
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
