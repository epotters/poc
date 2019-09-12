import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {InfoComponent} from "./info/info.component";

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
  }


  , {
    path: 'people',
    loadChildren: () => import('./people/person.module').then(mod => mod.PersonModule)
  },
  {
    path: 'organizations',
    loadChildren: () => import('./organizations/organization.module').then(mod => mod.OrganizationModule)
  },
  {
    path: 'employments',
    loadChildren: () => import('./employments/employment.module').then(mod => mod.EmploymentModule)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
