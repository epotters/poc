import {NgModule} from '@angular/core';

import {EntityCommonModule} from "../lib/entity-module/entity-common.module";
import {DialogModule} from "../lib/entity-module/dialog/dialog.module";

import {PocApiService} from "../core/service";
import {TableRowEditorModule} from "../lib/entity-module/table-row-editor/table-row-editor-module";
import {EmploymentListComponent} from "./employments-list.component";
import {EmploymentService} from "./employment.service";
import {EmploymentEditorComponent} from "./employment-editor.component";
import {EmploymentRoutingModule} from "./employment-routing.module";


@NgModule({
  imports: [
    EntityCommonModule,
    DialogModule,
    TableRowEditorModule,
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


