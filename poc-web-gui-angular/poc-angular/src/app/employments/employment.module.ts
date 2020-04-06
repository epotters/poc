import {NgModule} from '@angular/core';

import {EntityModule} from 'entity-lib';
import {EmploymentEditorComponent} from './employment-editor.component';
import {EmploymentRoutingModule} from './employment-routing.module';
import {EmploymentListComponent} from './employments-list.component';

// import {META, SERVICE} from 'entity-lib';


@NgModule({
  imports: [
    EntityModule,
    EmploymentRoutingModule
  ],
  declarations: [
    EmploymentListComponent,
    EmploymentEditorComponent,
  ],
  entryComponents: [
    EmploymentListComponent,
    EmploymentEditorComponent
  ]
})
export class EmploymentModule {
}


