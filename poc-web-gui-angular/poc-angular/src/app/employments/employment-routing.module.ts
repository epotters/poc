import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../lib/auth-lib';
import {EmploymentListComponent} from './employments-list.component';
import {EmploymentEditorComponent} from './employment-editor.component';

const base = '';

const routes: Routes = [
  {
    path: base,
    component: EmploymentListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + 'new',
    component: EmploymentEditorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: base + ':id',
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
