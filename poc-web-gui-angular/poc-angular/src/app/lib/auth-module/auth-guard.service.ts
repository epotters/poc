import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";


@Injectable()
export class AuthGuardService implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.debugLog(route, state);
    // console.debug('About to set the return url to ' + route.url.join('/'));
    // this.authService.setReturnUrl(route.url.join('/'));

    console.debug('About to set the return url to ' + state.url);
    this.authService.setReturnUrl(state.url);

    console.debug('Return url was set to ' + this.authService.getReturnUrl());

    this.authService.startAuthentication();
    return false;
  }


  private isRouteProtected(path: string): boolean {
    for (let key in this.router.config) {
      let config = this.router.config[key];
      if (config.path == path && config.canActivate != null) {
        console.debug(config);
        return true;
      }
    }
    return false;
  }


  private debugLog(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {

    console.debug(this.router);
    console.debug('this.router.url: ' + this.router.url);

    console.debug('Is route protected?: ' + this.isRouteProtected(route.url.join('/')));

    console.debug(route);
    console.debug('route.url: ' + route.url.join('/'));
    console.debug('Is route protected?: ' + (route.routeConfig.canActivate != null));

    console.debug(state);
    console.debug('state.url: ' + state.url);
  }
}
