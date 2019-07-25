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
import {EmploymentEditorComponent} from "../employments/employment-editor.component";

const meta = organizationMeta;

const routes: Routes = [
  {
    path: meta.namePlural,
    component: OrganizationListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/new',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id/employees',
    component: EmploymentListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-manager',
    component: OrganizationManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-manager/:id',
    component: OrganizationManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-n-grid',
    component: OrganizationListNGridComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '-list-of-cards',
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
