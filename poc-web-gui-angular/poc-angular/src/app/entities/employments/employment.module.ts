import {NgModule} from '@angular/core';

import {EntityModule}  from '@epotters/entities';
import {EmploymentEditorComponent} from './employment-editor.component';
import {EmploymentRoutingModule} from './employment-routing.module';
import {EmploymentListComponent} from './employments-list.component';


@NgModule({
  imports: [
    EntityModule,
    EmploymentRoutingModule
  ],
  declarations: [
    EmploymentListComponent,
    EmploymentEditorComponent,
  ]
})
export class EmploymentModule {
}


