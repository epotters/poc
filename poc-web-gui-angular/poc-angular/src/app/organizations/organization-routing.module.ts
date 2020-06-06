import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '@epotters/auth';
import {OrganizationEditorComponent} from './organization-editor.component';
import {OrganizationListOfCardsComponent} from './organization-list-of-cards.component';

import {OrganizationListComponent} from './organization-list.component';
import {OrganizationManagerComponent} from './organization-manager.component';


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
    path: base + 'cards',
    component: OrganizationListOfCardsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + ':id',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
