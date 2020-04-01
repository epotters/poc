import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router) {
    console.info('Constructing the AuthGuardService');
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else if (this.authService.isExpired()) {
      this.authService.startSilentAuthentication(state.url);
      return false;
    } else {
      this.authService.startAuthentication(state.url);
      return false;
    }
  }


  private isRouteProtected(path: string): boolean {
    for (const key in this.router.config) {
      const config = this.router.config[key];
      if (config.path === path && config.canActivate != null) {
        return true;
      }
    }
    return false;
  }
}
