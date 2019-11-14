import {Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserManager} from 'oidc-client';
import {ConfigService} from "../../app-config.service";

export {User};

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private userManager: UserManager;
  private user: User;
  private returnUrlKey: string = 'auth:redirect';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService) {
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
    return this.user != null && !this.user.expired;
  }

  public getClaims(): any {
    return this.user.profile;
  }

  public getAuthorizationHeaderValue(): string {
    // Bearer is case sensitive, token_type is lowercase, doesn't work
    return AuthService.capitalizeFirst(this.user.token_type) + ' ' + this.user.access_token;
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

  public startSilentAuthentication(): Promise<User> {
    console.debug('Silent authentication - About to set return url to ' + this.router.url);
    this.setReturnUrl(this.router.url);
    return this.userManager.signinSilent();
  }

  public completeSilentAuthentication(): Promise<void> {
    return this.userManager.signinSilentCallback().then(user => {
      this.user = user;
      console.debug('completeSilentAuthentication: User set. Is returnToUrl needed here or is the callback page loaded in the iframe?');
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

  public getReturnUrl(): string {
    return sessionStorage.getItem(this.returnUrlKey);
  }

  public returnToUrl(): void {
    var returnUrl = this.getReturnUrl();
    if (returnUrl) {
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
