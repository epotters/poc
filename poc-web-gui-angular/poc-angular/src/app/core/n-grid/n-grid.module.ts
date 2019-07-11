import {NgModule} from '@angular/core';

import {PblNgridMaterialModule} from "@pebula/ngrid-material";
import {PblNgridStatePluginModule} from "@pebula/ngrid/state";
import {PblNgridModule} from "@pebula/ngrid";
import {PblNgridStickyModule} from "@pebula/ngrid/sticky";
import {PblNgridDetailRowModule} from "@pebula/ngrid/detail-row";
import {PblNgridTransposeModule} from "@pebula/ngrid/transpose";
import {PblNgridBlockUiModule} from "@pebula/ngrid/block-ui";
import {PblNgridTargetEventsModule} from "@pebula/ngrid/target-events";
import {PblNgridDragModule} from "@pebula/ngrid/drag";

import {CommonTableTemplatesComponent} from "./common-table-templates/common-table-templates.component";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PblNgridModule.withCommon([{component: CommonTableTemplatesComponent}]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridMaterialModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    PblNgridModule,
    PblNgridDragModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridMaterialModule
  ],

  declarations: [
    CommonTableTemplatesComponent
  ],
  entryComponents: [
    CommonTableTemplatesComponent
  ],
})
export class NGridModule {
}


