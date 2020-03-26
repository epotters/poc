import {NgModule} from '@angular/core';
import {NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {InfoComponent} from './info/info.component';
import {AuthGuardService} from './lib/auth-module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: 'people',
    loadChildren: () => import('./people/person.module').then(mod => mod.PersonModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'organizations',
    loadChildren: () => import('./organizations/organization.module').then(mod => mod.OrganizationModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'employments',
    loadChildren: () => import('./employments/employment.module').then(mod => mod.EmploymentModule),
    canActivate: [AuthGuardService],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  // Source: https://medium.com/@davidgolverdingen/adding-routes-dynamically-to-lazy-loaded-modules-in-angular-a8daecfaebf9
  constructor(private router: Router) {

    this.router.events.subscribe(async routerEvent => {
      if (routerEvent instanceof NavigationStart) {
        console.info('Start navigation to url', routerEvent.url);
      }
      else if (routerEvent instanceof RouteConfigLoadEnd) {
        console.info('Module loaded lazily from path', routerEvent.route.path);
      }

      if (routerEvent instanceof NavigationEnd) {
        console.info('End navigation to url', routerEvent.url);
      }

    });
  }
}
