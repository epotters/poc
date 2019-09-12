import {NgModule} from '@angular/core';

import {EntityModule} from "../lib/entity-module/entity.module";
import {META, SERVICE} from "../lib/entity-module/entity-tokens";

import {EmploymentListComponent} from "./employments-list.component";
import {EmploymentService} from "./employment.service";
import {EmploymentEditorComponent} from "./employment-editor.component";
import {EmploymentRoutingModule} from "./employment-routing.module";
import {employmentMeta} from "./employment-meta";


@NgModule({
  imports: [
    EntityModule,
    EmploymentRoutingModule
  ],
  declarations: [
    EmploymentListComponent,
    EmploymentEditorComponent
  ],
  entryComponents: [
    EmploymentListComponent,
    EmploymentEditorComponent
  ],
  providers: [
    {provide: META, useValue: employmentMeta},
    {provide: SERVICE, useExisting: EmploymentService}
  ]
})
export class EmploymentModule {
}


