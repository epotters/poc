import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {employmentMeta as meta} from "./employment-meta";
import {AuthGuardService} from "../lib/auth-module";
import {EmploymentListComponent} from "./employments-list.component";
import {EmploymentEditorComponent} from "./employment-editor.component";


const routes: Routes = [
  {
    path: meta.namePlural,
    component: EmploymentListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/new',
    component: EmploymentEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: meta.namePlural + '/:id',
    component: EmploymentEditorComponent,
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploymentRoutingModule {
}
