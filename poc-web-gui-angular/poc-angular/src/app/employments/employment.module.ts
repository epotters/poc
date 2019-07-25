import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {TableFilterModule} from "../lib/entity-module/table-filter/table-filter-module";
import {EmploymentListComponent} from "./employments-list.component";
import {EmploymentService} from "./employment.service";
import {EmploymentEditorComponent} from "./employment-editor.component";
import {EmploymentRoutingModule} from "./employment-routing.module";


@NgModule({
  imports: [
    EntityCommonModule,
    DialogModule,
    TableFilterModule,
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
    PocApiService,
    EmploymentService
  ]
})
export class EmploymentModule {
}


