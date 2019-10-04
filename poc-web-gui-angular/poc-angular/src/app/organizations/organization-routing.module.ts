import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OrganizationListComponent} from "./organization-list.component";
import {OrganizationEditorComponent} from "./organization-editor.component";
import {AuthGuardService} from "../lib/auth-module";
import {OrganizationManagerComponent} from "./organization-manager.component";
import {OrganizationListNGridComponent} from "./organization-list-n-grid.component";
import {OrganizationListOfCardsComponent} from "./organization-list-of-cards.component";


const base = '';  // For eager loading use: organizationMeta.namePlural;

const routes: Routes = [
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
    path: base,
    component: OrganizationListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'new',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + ':id',
    component: OrganizationEditorComponent,
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
