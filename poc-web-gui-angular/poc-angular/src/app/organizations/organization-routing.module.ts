import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationEditorComponent} from "./organization-editor.component";
import {organizationMeta} from "./organization-meta";
import {AuthGuardService} from "../lib/auth-module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";
import {EmploymentListComponent} from "../employments/employments-list.component";

const meta = organizationMeta;
const base = '';  // meta.namePlural;

const routes: Routes = [
  {
    path: base,
    component: OrganizationListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'new',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  },
  // {
  //   path: base + '/:id/employees',
  //   component: EmploymentListComponent,
  //   canActivate: [AuthGuardService]
  // },
  {
    path: base + ':id',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'manager',
    component: OrganizationManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'manager/:id',
    component: OrganizationManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'n-grid',
    component: OrganizationListNGridComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'list-of-cards',
    component: OrganizationListOfCardsComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
