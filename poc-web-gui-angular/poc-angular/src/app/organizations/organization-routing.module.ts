import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationComponent} from "./organization.component";
import {OrganizationMeta} from "./organization-meta";
import {AuthGuardService} from "../lib/auth-module";

const meta = new OrganizationMeta();

const routes: Routes = [
  {
    path: meta.namePlural,
    component: OrganizationListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/new',
    component: OrganizationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id',
    component: OrganizationComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
