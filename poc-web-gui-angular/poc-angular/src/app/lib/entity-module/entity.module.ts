import {NgModule} from "@angular/core";
import {EntityCommonModule} from "./common/entity-common.module";
import {EntityMaterialModule} from "./common/entity-material.module";

import {TableRowEditorModule} from "./table-row-editor/table-row-editor.module";
import {DialogModule} from "./dialog/dialog.module";

import {NGridModule} from "../../core/n-grid/n-grid.module";


@NgModule({
  imports: [
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    DialogModule,

    NGridModule
  ],
  exports: [
    EntityCommonModule,
    EntityMaterialModule,
    TableRowEditorModule,
    DialogModule,

    NGridModule
  ]
})

export class EntityModule {
}
